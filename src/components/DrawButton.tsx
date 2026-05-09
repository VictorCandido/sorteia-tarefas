"use client";

import { motion } from "framer-motion";
import { RiShuffleFill } from "react-icons/ri";

interface DrawButtonProps {
  onClick: () => void;
  disabled: boolean;
  spinning: boolean;
  taskCount: number;
}

export default function DrawButton({ onClick, disabled, spinning, taskCount }: DrawButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <motion.button
        onClick={onClick}
        disabled={disabled || spinning}
        whileHover={!disabled && !spinning ? { scale: 1.05 } : {}}
        whileTap={!disabled && !spinning ? { scale: 0.95 } : {}}
        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center
          transition-all duration-300 ${
            disabled
              ? "bg-surface-800 border-2 border-surface-700 cursor-not-allowed"
              : spinning
              ? "bg-accent/20 border-2 border-accent animate-pulse-glow cursor-wait"
              : "bg-accent/15 border-2 border-accent/40 hover:border-accent hover:bg-accent/20 cursor-pointer"
          }`}
      >
        {/* Outer ring animation */}
        {spinning && (
          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-transparent border-t-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Inner ring */}
        {!disabled && !spinning && (
          <motion.div
            className="absolute inset-2 rounded-full border border-accent/20"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <motion.div animate={spinning ? { rotate: 360 } : {}} transition={{ duration: 0.6, repeat: spinning ? Infinity : 0, ease: "linear" }}>
          <RiShuffleFill
            className={`text-3xl sm:text-4xl ${
              disabled ? "text-surface-600" : "text-accent"
            }`}
          />
        </motion.div>
      </motion.button>

      <div className="text-center">
        <p className="text-sm font-display font-bold text-surface-300">
          {disabled ? "Sem tarefas" : spinning ? "Sorteando..." : "Sortear"}
        </p>
        {!disabled && (
          <p className="text-xs text-surface-500 mt-0.5">
            {taskCount} tarefa{taskCount !== 1 ? "s" : ""} pendente{taskCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
