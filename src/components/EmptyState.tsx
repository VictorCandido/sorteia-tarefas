"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-800/60 border border-surface-700/40 flex items-center justify-center mb-4">
        <Icon className="text-2xl text-surface-500" />
      </div>
      <h3 className="text-sm font-display font-bold text-surface-400 mb-1">{title}</h3>
      <p className="text-xs text-surface-500 max-w-[240px]">{description}</p>
    </motion.div>
  );
}
