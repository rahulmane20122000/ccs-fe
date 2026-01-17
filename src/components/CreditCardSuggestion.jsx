import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export const CreditCardSuggestion = ({ card, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-2xl p-0 relative overflow-hidden flex flex-col h-full border-t border-white/20"
    >
      {/* Dynamic Gradient Background Glow */}
      <div className={cn("absolute top-0 left-0 right-0 h-32 bg-gradient-to-b opacity-20 blur-2xl pointer-events-none", card.colors)} />

      {/* Badge */}
      {card.highlight && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1">
             <Star size={10} fill="currentColor" /> {card.highlight}
          </span>
        </div>
      )}

      <div className="p-6 relative z-10 flex flex-col h-full">
        {/* Card Image and Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-32 h-20 rounded-lg bg-gray-800 relative overflow-hidden shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                {/* Glare effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{card.name}</h3>
                <p className="text-xs text-green-400 font-medium">98% Match Score</p>
            </div>
        </div>

        {/* Why this fits */}
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200">
                <span className="font-semibold text-blue-100">Why it fits:</span> {card.matchReason}
            </p>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6 flex-grow">
            {card.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                </div>
            ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 mt-auto">
            <button className="flex-1 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                View Details
            </button>
            <button className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all">
                Apply Now <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};
