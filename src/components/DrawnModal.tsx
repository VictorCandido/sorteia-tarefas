"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RiCheckDoubleLine, RiCloseLine, RiMagicLine } from "react-icons/ri";
import { Task } from "@/lib/types";

interface DrawnModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function DrawnModal({ task, onClose }: DrawnModalProps) {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Confetti-like particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: Math.cos((i / 12) * Math.PI * 2) * 180,
                y: Math.sin((i / 12) * Math.PI * 2) * 180,
              }}
              transition={{
                duration: 1.2,
                delay: 0.2 + i * 0.05,
                ease: "easeOut",
              }}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-mint" : "bg-yellow-400"
              }`}
            />
          ))}

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-surface-900 border border-surface-700/50 rounded-2xl
                       overflow-hidden shadow-2xl shadow-black/30"
          >
            {/* Glow effect at top */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/10 to-transparent" />

            <div className="relative p-6 sm:p-8 text-center">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-500
                           hover:text-surface-200 hover:bg-surface-800 transition-colors"
              >
                <RiCloseLine className="text-lg" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                className="inline-flex w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25
                           items-center justify-center mb-5"
              >
                <RiMagicLine className="text-3xl text-accent" />
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs font-display font-bold tracking-widest text-accent uppercase mb-3"
              >
                Tarefa Sorteada
              </motion.p>

              {/* Task title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl font-bold text-surface-50 leading-snug mb-6"
              >
                {task.title}
              </motion.h2>

              {/* CTA button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark
                           text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <RiCheckDoubleLine />
                Entendido, bora!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
