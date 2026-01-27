import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AppUsageList = ({ apps }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;
  
  // Determine which apps to show
  const displayedApps = isExpanded ? apps : apps.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = apps.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="glass-card p-6 rounded-2xl w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        Most Used Services
      </h3>
      
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {displayedApps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ 
                duration: 0.3,
                delay: isExpanded ? 0 : 0.05 * index 
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className="flex items-center gap-4">
                {/* Fallback avatar if icon url fails or is text-based in real app */}
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                  <img src={app.icon} alt={app.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <p className="font-medium text-white">{app.name}</p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span className={app.name === "Connection Failed" ? "text-red-400" : ""}>{app.category}</span>
                    {app.count !== undefined && (
                      <>
                        <span>•</span>
                        <span>{app.count} txns</span>
                      </>
                    )}
                    {app.amount && (
                      <>
                        <span>•</span>
                        <span className="text-gray-300">{app.amount}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-300 hover:text-white group"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
            </>
          ) : (
            <>
              <span>Show More ({apps.length - INITIAL_DISPLAY_COUNT} more)</span>
              <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};
