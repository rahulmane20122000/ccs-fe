import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { TrendingUp, ShoppingBag, Plane, Utensils, Film, DollarSign } from 'lucide-react';

const iconMap = {
  "Dining": Utensils,
  "Travel": Plane,
  "Shopping": ShoppingBag,
  "Entertainment": Film,
  "default": DollarSign
};

export const SpendingCard = ({ title, amount, iconName, color, className, delay = 0 }) => {
  const Icon = iconMap[iconName] || iconMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("glass-card p-6 rounded-2xl flex flex-col items-start justify-between min-h-[140px] relative overflow-hidden group", className)}
    >
        <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity", color)}></div>
        
        <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg bg-white/5 text-white/90", color ? `text-${color.split('-')[1]}-400` : "")}>
                <Icon size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">{title}</span>
        </div>

        <div className="mt-auto">
             <h3 className="text-3xl font-bold text-white tracking-tight">
                ₹{amount.toLocaleString()}
            </h3>
        </div>
    </motion.div>
  );
};
