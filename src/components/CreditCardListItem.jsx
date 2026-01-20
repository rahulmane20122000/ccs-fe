import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const CreditCardListItem = ({ card, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden border border-white/10 transition-colors hover:border-white/20"
    >
      {/* Header - Always Visible */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-4 flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors relative"
      >
         {/* Highlight Badge (absolute or integrated) */}
         {card.highlight && (
            <div className="absolute top-0 right-0">
               <span className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-bl-lg text-white bg-gradient-to-r", card.colors)}>
                  {card.highlight}
               </span>
            </div>
         )}

        {/* Card Image Thumbnail */}
        <div className="w-16 h-10 rounded bg-gray-800 overflow-hidden shrink-0 border border-white/10">
           <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white truncate">{card.name}</h4>
            <p className="text-xs text-green-400 font-medium">{card.matchReason ? '98% Match' : 'Recommended'}</p>
        </div>

        {/* Chevron */}
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-gray-400"
        >
            <ChevronDown size={20} />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-5 border-t border-white/5">
                
                {/* Why it fits */}
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-200">
                        <span className="font-semibold text-blue-100">Why it fits:</span> {card.matchReason}
                    </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                    {card.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <Check size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="flex-1 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                        View Details
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
                        Apply Now <ArrowRight size={16} />
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
