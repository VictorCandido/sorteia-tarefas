"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiAddLine, RiLoader4Line } from "react-icons/ri";

interface TaskFormProps {
  onAdd: (title: string) => Promise<boolean>;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    const success = await onAdd(title.trim());
    if (success) {
      setTitle("");
      inputRef.current?.focus();
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Nova tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            maxLength={200}
            className="w-full px-4 py-3.5 bg-surface-900/60 border border-surface-700/50 rounded-xl
                       text-surface-100 placeholder:text-surface-500 font-body text-sm
                       focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10
                       transition-all duration-200"
          />
          <AnimatePresence>
            {title.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-surface-500"
              >
                {title.length}/200
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!title.trim() || submitting}
          className="px-4 py-3.5 bg-accent hover:bg-accent-dark disabled:bg-surface-700 disabled:text-surface-500
                     text-white font-semibold rounded-xl transition-colors duration-200
                     flex items-center gap-2 text-sm"
        >
          {submitting ? (
            <RiLoader4Line className="text-lg animate-spin" />
          ) : (
            <RiAddLine className="text-lg" />
          )}
          <span className="hidden sm:inline">Adicionar</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
