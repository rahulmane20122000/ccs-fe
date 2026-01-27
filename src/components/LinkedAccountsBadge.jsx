import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Users } from 'lucide-react';

const LinkedAccountsBadge = ({ linkedCount }) => {
  if (!linkedCount || linkedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
    >
      <Link2 size={14} className="text-purple-400" />
      <span className="text-xs font-medium text-purple-300">
        Includes {linkedCount} linked {linkedCount === 1 ? 'account' : 'accounts'}
      </span>
      <Users size={14} className="text-purple-400" />
    </motion.div>
  );
};

export default LinkedAccountsBadge;
