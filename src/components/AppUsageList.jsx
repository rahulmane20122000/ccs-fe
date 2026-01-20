import React from 'react';
import { motion } from 'framer-motion';

export const AppUsageList = ({ apps }) => {
  return (
    <div className="glass-card p-6 rounded-2xl w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        Most Used Services
      </h3>
      <div className="space-y-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
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
      </div>
    </div>
  );
};
