// Mock API Service

const DELAY = 2000;

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
