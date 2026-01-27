import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthButton } from './components/AuthButton';
import { Loader } from './components/Loader';
import { SpendingCard } from './components/SpendingCard';
import { AppUsageList } from './components/AppUsageList';
import { CreditCardListItem } from './components/CreditCardListItem';
import ProfileDropdown from './components/ProfileDropdown';
import LinkedAccountsModal from './components/LinkedAccountsModal';
import { ResyncButton } from './components/ResyncButton';
import './components/LinkedAccounts.css';

import { mockAuth, mockData, authAPI } from './services/api';
import { CreditCard, Wallet } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing'); // landing, analyzing, dashboard
  const [user, setUser] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [cards, setCards] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showLinkedAccountsModal, setShowLinkedAccountsModal] = useState(false);

  const dataFetchRef = React.useRef(false);

  // Check for session or callback on mount
  useEffect(() => {
    // Prevent double-firing in Strict Mode
    if (dataFetchRef.current) return;
    dataFetchRef.current = true;

    const checkSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlUserId = params.get('userId');
      const urlToken = params.get('token'); 
      const urlName = params.get('name');
      const urlPicture = params.get('picture');
      const error = params.get('error');
      const errorMessage = params.get('message');

      // ✅ Handle login errors (e.g., trying to login with a linked account)
      if (error === 'linked_account_login') {
        alert(errorMessage || 'This account is linked to another user. Please login with your primary account instead.');
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Determine effective User ID (URL takes precedence)
      const effectiveUserId = urlUserId || localStorage.getItem('auth_userId');
      const effectiveToken = urlToken || localStorage.getItem('auth_token');

      if (!effectiveUserId) return; // No user, stay on landing

      // 0. Update Storage if URL params present
      if (urlUserId) {
        localStorage.setItem('auth_userId', urlUserId);
        if (urlToken) localStorage.setItem('auth_token', urlToken);
        if (urlName) localStorage.setItem('auth_userName', decodeURIComponent(urlName));
        if (urlPicture) localStorage.setItem('auth_userPicture', decodeURIComponent(urlPicture));
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 1. Check for CACHED Data to avoid API hit
      const cachedData = localStorage.getItem(`cached_data_${effectiveUserId}`);
      if (cachedData) {
        try {
           const parsedData = JSON.parse(cachedData);
           
           // Check if cache contains the "Pending" error state OR if it has outdated "User" fallback data
           const hasOldIconUrls = parsedData.apps && parsedData.apps.some(a => 
             a.icon && a.icon.includes('ui-avatars.com') && a.icon.includes('background=random')
           );
           
           const isInvalidCache = parsedData.isFallback || 
                                  hasOldIconUrls || // ✅ Invalidate if using old random avatar URLs
                                  (parsedData.apps && parsedData.apps.some(a => a.name === "Backend Pending")) ||
                                  (parsedData.user && parsedData.user.name === "User"); // Force refresh to get real name/pic

           if (!isInvalidCache) {
               console.log("Restoring from VALID Cache");
               populateDashboard(parsedData);
               return; // Stop here, do not hit API
           } else {
               console.log("Invalidating bad/stale cache");
               localStorage.removeItem(`cached_data_${effectiveUserId}`);
           }
        } catch (e) {
           console.error("Cache parse error", e);
           localStorage.removeItem(`cached_data_${effectiveUserId}`);
        }
      }

      // 2. Fetch from API if no cache
      await loginWithUserId(effectiveUserId, effectiveToken);
    };

    checkSession();
  }, []);

  const populateDashboard = async (data) => {
        const userObj = data.user || {
             name: localStorage.getItem('auth_userName') || "User", 
             email: "user@example.com", 
             avatar: localStorage.getItem('auth_userPicture') || "https://i.pravatar.cc/150"
        };
        setUser(userObj);
        
        let spending = { monthlySpend: 0, topCategories: [], frequentApps: [] };
        
        if (data.apps) {
             spending = {
                monthlySpend: data.totalSpend !== undefined ? data.totalSpend : 45000, 
                topCategories: data.categories || [],
                frequentApps: data.apps
             };
        } else {
             // Basic fallback structure if data is empty
             spending = { monthlySpend: 0, topCategories: [], frequentApps: [] };
        }

        // Fetch cards and wait before showing dashboard to avoid pop-in
        try {
            const suggestions = await mockData.fetchCardSuggestions();
            setCards(suggestions);
        } catch (err) {
            console.error("Failed to fetch card suggestions", err);
            setCards([]);
        }

        setSpendingData(spending);
        setView('dashboard');
  };

  const loginWithUserId = async (userId, token) => {
    setIsAuthLoading(true);
    setView('analyzing'); // Show loader immediately while fetching data
    try {
        const data = await authAPI.getUserApps(userId, token);
        
        // CACHE THE RESULT ONLY IF VALID
        if (data && !data.error && !data.isFallback) {
            console.log("Caching fresh API data");
            localStorage.setItem(`cached_data_${userId}`, JSON.stringify(data));
            await populateDashboard(data);
            
            // ✅ REMOVED: Automatic background sync
            // The first fetch now returns ALL accounts' cached data
            // User can manually trigger sync with the Resync button if needed
        } else if (data && data.isFallback) {
             console.warn("Using fallback data (Not Caching)");
             await populateDashboard(data);
        } else {
             throw new Error("Invalid data received");
        }
    } catch (error) {
        console.error("Session restore failed", error);
        // Do NOT remove userId here, allows retry on refresh
        // Go back to landing if analysis failed
        setView('landing'); 
    } finally {
        setIsAuthLoading(false);
    }
  };



  // Handle Login
  const handleLogin = () => {
    setIsAuthLoading(true); // Optional, visual feedback before redirect
    authAPI.loginWithGoogle();
  };

  const handleLogout = () => {
    // Clear Session
    const userId = localStorage.getItem('auth_userId');
    if (userId) {
        localStorage.removeItem(`cached_data_${userId}`);
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_userId');
    localStorage.removeItem('auth_userName');
    localStorage.removeItem('auth_userPicture');
    
    // Clear State
    setUser(null);
    setSpendingData(null);
    setCards([]);
    
    // Reset URL to avoid re-login on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
    
    setView('landing');
  };

  // Simulate Data Fetching & Analysis
  const fetchData = async () => {
    try {
      const [spending, suggestions] = await Promise.all([
        mockData.fetchSpendingInsights(),
        mockData.fetchCardSuggestions()
      ]);
      
      setSpendingData(spending);
      setCards(suggestions);
      
      // Artificial delay to show the "Analyzing" animation for a bit longer if data is too fast, 
      // but the mock services already have delays.
      setTimeout(() => {
        setView('dashboard');
      }, 500); 
    } catch (error) {
        console.error("Data fetch error", error);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30">
      
      {/* Navbar (conditional) */}
      <AnimatePresence>
        {view === 'dashboard' && (
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                            <CreditCard size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-wide">CardSuggest</span>
                    </div>
                    <ProfileDropdown 
                        user={user}
                        onLogout={handleLogout}
                        onOpenAccounts={() => setShowLinkedAccountsModal(true)}
                    />
                </div>
            </motion.nav>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full min-h-screen flex flex-col">
          
        <AnimatePresence mode="wait">
          
          {/* LANDING VIEW */}
          {view === 'landing' && (
            <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center flex-grow p-6 text-center relative max-w-4xl mx-auto"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-6">
                        Smart Card Recommendations
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Turn your spending <br /> into <span className="text-gradient">smarter rewards.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        We analyze your transaction patterns to find the perfect credit cards that maximize your cashback, miles, and benefits.
                    </p>
                    
                    <div className="flex justify-center">
                        <AuthButton isLoading={isAuthLoading} onClick={handleLogin} />
                    </div>
                </motion.div>
            </motion.div>
          )}

          {/* ANALYZING VIEW */}
          {view === 'analyzing' && (
            <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center flex-grow p-6 absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
            >
                <Loader text="Analyzing your spending patterns..." />
            </motion.div>
          )}

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && spendingData && (
            <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col gap-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                   <div>
                      <h2 className="text-2xl font-bold mb-1">Your Financial Snapshot</h2>
                      <p className="text-gray-400">Based on your last 6 months of spending.</p>
                   </div>
                   {/* ✅ Resync Button */}
                   {user && (
                     <ResyncButton 
                       userId={localStorage.getItem('auth_userId')} 
                       onSyncComplete={(data) => {
                         setSpendingData({
                           monthlySpend: data.totalSpend || 0,
                           topCategories: data.categories || [],
                           frequentApps: data.apps || []
                         });
                       }}
                     />
                   )}
                </div>

                {/* Spending Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SpendingCard 
                        title="Total Spend" 
                        amount={spendingData.monthlySpend} 
                        iconName="default" 
                        color="bg-emerald-500" 
                        delay={0}
                    />
                    {spendingData.topCategories.slice(0, 3).map((cat, i) => (
                        <SpendingCard
                            key={cat.name}
                            title={cat.name}
                            amount={cat.amount}
                            iconName={cat.name}
                            color={i === 0 ? "bg-blue-500" : i === 1 ? "bg-purple-500" : "bg-orange-500"}
                            delay={0.1 * (i + 1)}
                        />
                    ))}
                </div>




                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* App Usage List */}
                     <div className="lg:col-span-1">
                        <AppUsageList apps={spendingData.frequentApps} />
                     </div>

                     {/* Credit Card Suggestions */}
                     <div className="lg:col-span-2">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Wallet className="text-yellow-500" />
                                Recommended Cards
                            </h3>
                            <span className="text-sm text-cyan-400 cursor-pointer hover:underline">View all matches</span>
                         </div>
                         <div className="flex flex-col gap-4">
                             {cards.map((card, i) => (
                                 <CreditCardListItem key={card.id} card={card} index={i} />
                             ))}
                         </div>
                     </div>
                </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Linked Accounts Modal */}
      <LinkedAccountsModal 
        isOpen={showLinkedAccountsModal}
        onClose={() => setShowLinkedAccountsModal(false)}
        userId={localStorage.getItem('auth_userId')}
      />
    </div>
  );
}

export default App;
