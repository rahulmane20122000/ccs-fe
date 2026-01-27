// Example: How to integrate LinkedAccounts component in App.jsx
// Add this import at the top with other component imports:

import LinkedAccounts from './components/LinkedAccounts';
import './components/LinkedAccounts.css';

// Then in your dashboard view, add the LinkedAccounts component.
// You can add it anywhere in the dashboard section.
// Here's an example of where to place it:

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

      {/* 🆕 ADD LINKED ACCOUNTS HERE - Before Spending Cards */}
      <LinkedAccounts userId={localStorage.getItem('auth_userId')} />

      {/* Spending Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ... existing spending cards ... */}
      </div>

      {/* ... rest of dashboard ... */}
  </motion.div>
)}

// Alternative placement options:

// Option 1: In a separate "Settings" or "Accounts" section
// You could add a tab/section for account management

// Option 2: In a modal/popup
// Triggered by a button in the navbar

// Option 3: In the sidebar (if you add one)
// As part of user profile/settings

// Example with a modal approach:
// -----------------------------------

// Add state for modal:
const [showLinkedAccounts, setShowLinkedAccounts] = useState(false);

// Add button in navbar:
<button 
    onClick={() => setShowLinkedAccounts(true)}
    className="text-sm text-gray-400 hover:text-white"
>
    Linked Accounts
</button>

// Add modal in your render:
{showLinkedAccounts && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
    <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Accounts</h2>
          <button 
            onClick={() => setShowLinkedAccounts(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <LinkedAccounts userId={localStorage.getItem('auth_userId')} />
      </div>
    </div>
  </div>
)}
