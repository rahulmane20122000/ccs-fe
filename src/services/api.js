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
            { name: "Swiggy", category: "Dining", icon: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" },  // Using direct URLs or placeholders
            { name: "Uber", category: "Travel", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
            { name: "Amazon", category: "Shopping", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
            { name: "Netflix", category: "Entertainment", icon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png" },
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
            image: "https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/04c4b693-0181-42cb-93b5-7798369650e8/Regalia%20Gold%20Credit%20Card_264x167.png", // specific or generic
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
            image: "https://icm.aexp-static.com/Internet/internationalcardshop/en_in/images/cards/Platinum_Travel_Card_480x304.png",
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
            image: "https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/credit-card/amazon-pay-credit-card.png",
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
