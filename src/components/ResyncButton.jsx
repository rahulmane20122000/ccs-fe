import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResyncButton = ({ userId, onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    
    try {
      const { authAPI } = await import('../services/api');
      const result = await authAPI.syncUserApps(userId);
      
      if (result.synced) {
        setLastSyncTime(new Date());
        if (onSyncComplete) {
          onSyncComplete(result);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
      // Could show error toast here
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <motion.button
      onClick={handleSync}
      disabled={isSyncing}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-300
        ${isSyncing 
          ? 'bg-white/5 cursor-not-allowed' 
          : 'bg-white/10 hover:bg-white/20 active:scale-95'}
        border border-white/10
        text-sm font-medium text-white/90
      `}
      whileTap={{ scale: isSyncing ? 1 : 0.95 }}
    >
      <RefreshCw 
        size={16} 
        className={`${isSyncing ? 'animate-spin' : ''} transition-transform`}
      />
      <span>{isSyncing ? 'Syncing...' : 'Resync Data'}</span>
      
      {lastSyncTime && !isSyncing && (
        <span className="text-xs text-white/50">
          ({new Date(lastSyncTime).toLocaleTimeString()})
        </span>
      )}
    </motion.button>
  );
};
