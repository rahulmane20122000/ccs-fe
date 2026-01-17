import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthButton } from './components/AuthButton';
import { Loader } from './components/Loader';
import { SpendingCard } from './components/SpendingCard';
import { AppUsageList } from './components/AppUsageList';
import { CreditCardSuggestion } from './components/CreditCardSuggestion';
import { mockAuth, mockData } from './services/api';
import { CreditCard, LogOut, Wallet } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing'); // landing, analyzing, dashboard
  const [user, setUser] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [cards, setCards] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Handle Login
  const handleLogin = async () => {
    setIsAuthLoading(true);
    try {
      const response = await mockAuth.loginWithGoogle();
      setUser(response.user);
      setView('analyzing');
      
      // Start fetching data immediately after login transition
      fetchData(); 
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthLoading(false);
    }
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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                            <img src={user?.avatar} alt="User" className="w-6 h-6 rounded-full" />
                            <span className="text-sm font-medium text-gray-300 pr-2">{user?.name}</span>
                        </div>
                        <button 
                            onClick={() => setView('landing')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
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
                <div>
                   <h2 className="text-2xl font-bold mb-1">Your Financial Snapshot</h2>
                   <p className="text-gray-400">Based on your last 6 months of spending.</p>
                </div>

                {/* Spending Insights Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Monthly Spend - Large Card */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <SpendingCard 
                            title="Monthly Average" 
                            amount={spendingData.monthlySpend} 
                            iconName="default" 
                            color="from-green-500 to-emerald-700"
                            className="h-full min-h-[180px]"
                        />
                    </div>

                    {/* Top Categories - Grid */}
                    <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {spendingData.topCategories.map((cat, i) => (
                            <SpendingCard 
                                key={cat.name}
                                title={cat.name}
                                amount={cat.amount}
                                iconName={cat.icon} // Ensure SpendingCard handles mapping or pass icon directly if updated
                                delay={i * 0.1}
                                className="bg-white/5"
                            />
                        ))}
                    </div>
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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {cards.map((card, i) => (
                                 <CreditCardSuggestion key={card.id} card={card} index={i} />
                             ))}
                         </div>
                     </div>
                </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
