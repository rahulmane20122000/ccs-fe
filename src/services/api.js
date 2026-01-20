// API Configuration
export const API_BASE_URL = "http://localhost:3000";
export const AUTH_ENDPOINTS = {
  googleLogin: `${API_BASE_URL}/auth/google/login`,
  me: `${API_BASE_URL}/auth/me`, // Assumption: Endpoint to get user details
};

const DELAY = 2000;

export const authAPI = {
  // Real Auth Methods
  loginWithGoogle: () => {
    window.location.href = AUTH_ENDPOINTS.googleLogin;
  },
  
  // Fetch user apps and stats
  getUserApps: async (userId, token) => {
    try {
      console.log(`[API] Fetching apps for user: ${userId}...`);
      
      const response = await fetch(`${API_BASE_URL}/auth/getUserApps/${userId}`, {
        mode: 'cors',
        headers: {
            'Accept': 'application/json'
        }
      });
      
      console.log(`[API] Headers received. Status: ${response.status}`);

      if (!response.ok) {
          const text = await response.text(); 
          let errorMessage = `API Error ${response.status}`;
          try {
              const json = JSON.parse(text);
              if (json.error) errorMessage = json.error;
          } catch {
              errorMessage += `: ${text}`;
          }
          throw new Error(errorMessage);
      }

      console.log(`[API] Parsing JSON...`);
      const json = await response.json();
      console.log(`[API] JSON Success:`, json);
      if(json.user) console.log(`[API] User Info:`, json.user);
      
      // Transform incoming data to match App's expected structure
      if (json.success && Array.isArray(json.data)) {
        // Simple Category Map for better UX
        const categoryMap = {
          Swiggy: "Dining", Zomato: "Dining",
          Amazon: "Shopping", Flipkart: "Shopping",
          Myntra: "Fashion", Ajio: "Fashion", Snitch: "Fashion", Beyoung: "Fashion",
          Nykaa: "Beauty", "Bellavitaorganic": "Beauty", "Aqualogica": "Beauty", "Bombayshavingcompany": "Personal Care",
          Linkedin: "Professional",
          Lenovo: "Electronics",
          Net: "Utilities",
          Pickrr: "Logistics", "Ithinklogistics": "Logistics"
        };

        const apps = json.data.map(item => ({
          name: item.app,
          count: item.count,
          amount: item.totalFormatted,
          total: item.total,
          currency: item.currency,
          category: categoryMap[item.app] || "General",
          // Generate an icon if not provided
          icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.app)}&background=random&color=fff&size=128`
        }));

        const totalSpend = apps.reduce((acc, curr) => acc + (curr.total || 0), 0);
        
        // Calculate categories
        const categoryGroups = apps.reduce((acc, app) => {
            acc[app.category] = (acc[app.category] || 0) + (app.total || 0);
            return acc;
        }, {});

        const categories = Object.keys(categoryGroups).map(cat => ({
            name: cat,
            amount: categoryGroups[cat],
            icon: "Hash" // Default icon, can be mapped if needed
        })).sort((a, b) => b.amount - a.amount);
        
        return {
          user: {
            name: json.user?.name || "User",
            email: json.user?.email || "user@example.com", 
            avatar: json.user?.picture || "https://i.pravatar.cc/150"
          },
          apps: apps,
          totalSpend: totalSpend,
          categories: categories
        };
      }
      
      return json;

    } catch (error) {
      console.error("[API] Request Failed:", error);
      
      return {
          isFallback: true,
          user: {
             id: userId,
             name: "Offline User",
             email: "check@backend.com",
             avatar: "https://i.pravatar.cc/150?u=error",
          },
          totalSpend: 0,
          categories: [],
          apps: [
             { 
               name: "Connection Failed", 
               // Show the actual error message in the UI so the user knows WHY
               category: error.message || "Unknown Network Error", 
               icon: "/assets/error.svg" 
             }
          ]
      };
    }
  }
};

export const mockAuth = {
  loginWithGoogle: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            name: "Alex Doe",
            email: "alex.doe@example.com",
            avatar: "https://i.pravatar.cc/150?u=alex",
          },
          token: "mock-jwt-token",
        });
      }, DELAY);
    });
  },
};

export const mockData = {
  fetchSpendingInsights: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          monthlySpend: 45000,
          topCategories: [
            { name: "Dining", amount: 12000, icon: "Utensils" },
            { name: "Travel", amount: 8000, icon: "Plane" },
            { name: "Shopping", amount: 15000, icon: "ShoppingBag" },
            { name: "Entertainment", amount: 5000, icon: "Film" },
          ],
          frequentApps: [
            { name: "Swiggy", category: "Dining", icon: "/assets/swiggy.svg" }, 
            { name: "Uber", category: "Travel", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1024px-Uber_logo_2018.svg.png" },
            { name: "Amazon", category: "Shopping", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" },
            { name: "Netflix", category: "Entertainment", icon: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
          ],
        });
      }, 2500); // Slightly longer simulation for analysis
    });
  },

  fetchCardSuggestions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([


          {
            id: 1,
            name: "HDFC Regalia Gold",
            image: "/assets/hdfc-gold.png",
            benefits: [
              "5X Reward Points on Dining",
              "Complimentary Airport Lounge Access",
              "Low Forex Markup (2%)",
            ],
            matchReason: "Perfect for your high dining and travel spend.",
            highlight: "Best Overall",
            colors: "from-yellow-600 to-yellow-900",
          },
          {
            id: 2,
            name: "Amex Platinum Travel",
            image: "/assets/amex-platinum.png",
            benefits: [
              "Milestone Bonus Points",
              "Travel Vouchers worth ₹10,000",
              "4 Complimentary Lounge Visits",
            ],
            matchReason: "Great for your monthly travel spends explicitly provided.",
            highlight: "Travel Focused",
            colors: "from-blue-700 to-cyan-900",
          },
          {
            id: 3,
            name: "Amazon Pay ICICI",
            image: "/assets/amazon-pay.png",
            benefits: [
              "5% Cashback on Amazon",
              "Lifetime Free",
              "1% Flat Cashback elsewhere",
            ],
            matchReason: "Direct savings on your Amazon shopping.",
            highlight: "Cashback King",
            colors: "from-orange-500 to-orange-700",
          },
        ]);
      }, 1500);
    });
  },
};
