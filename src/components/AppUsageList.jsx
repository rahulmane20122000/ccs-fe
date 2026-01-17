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
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                    <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
               </div>
               <div>
                   <p className="font-medium text-white">{app.name}</p>
                   <p className="text-xs text-gray-400">{app.category}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
