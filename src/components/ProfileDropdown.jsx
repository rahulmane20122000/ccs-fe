import React, { useState, useRef, useEffect } from 'react';
import { User, Link2, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown = ({ user, onLogout, onOpenAccounts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => {
        console.log('Profile clicked');
        setIsOpen(false);
      }
    },
    {
      icon: Link2,
      label: 'Linked Accounts',
      onClick: () => {
        onOpenAccounts();
        setIsOpen(false);
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: () => {
        onLogout();
        setIsOpen(false);
      },
      danger: true
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
      >
        <img 
          src={user?.avatar} 
          alt="User" 
          referrerPolicy="no-referrer" 
          className="w-6 h-6 rounded-full" 
        />
        <span className="text-sm font-medium text-gray-300 pr-1">{user?.name}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.avatar} 
                  alt="User" 
                  referrerPolicy="no-referrer" 
                  className="w-10 h-10 rounded-full" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors ${
                      item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
