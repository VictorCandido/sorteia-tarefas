"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RiDeleteBinLine, RiEditLine, RiCheckLine, RiCloseLine, RiTimeLine } from "react-icons/ri";

interface TaskCardProps {
  id: string;
  title: string;
  createdAt: string;
  drawnAt?: string | null;
  variant?: "pending" | "drawn";
  index: number;
  onUpdate?: (id: string, title: string) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function TaskCard({
  id,
  title,
  createdAt,
  drawnAt,
  variant = "pending",
  index,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = async () => {
    if (!editValue.trim() || editValue.trim() === title) {
      setEditing(false);
      setEditValue(title);
      return;
    }
    const success = await onUpdate?.(id, editValue.trim());
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete?.(id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: deleting ? 0 : 1, x: deleting ? 50 : 0, scale: deleting ? 0.9 : 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative px-4 py-3.5 rounded-xl border transition-all duration-200
        ${
          variant === "drawn"
            ? "bg-mint/5 border-mint/15 hover:border-mint/30"
            : "bg-surface-900/40 border-surface-800/40 hover:border-surface-700/60 hover:bg-surface-900/60"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Indicator dot */}
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            variant === "drawn" ? "bg-mint" : "bg-accent/60"
          }`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setEditValue(title);
                  }
                }}
                maxLength={200}
                className="flex-1 bg-surface-800 border border-surface-600 rounded-lg px-2.5 py-1
                           text-sm text-surface-100 focus:outline-none focus:border-accent/50"
              />
              <button onClick={handleSave} className="text-mint hover:text-mint-light p-1">
                <RiCheckLine />
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditValue(title);
                }}
                className="text-surface-400 hover:text-surface-200 p-1"
              >
                <RiCloseLine />
              </button>
            </div>
          ) : (
            <>
              <p className={`text-sm font-medium break-words ${variant === "drawn" ? "text-surface-300" : "text-surface-100"}`}>
                {title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <RiTimeLine className="text-xs text-surface-500" />
                <span className="text-xs text-surface-500">
                  {variant === "drawn" && drawnAt
                    ? `Sorteada em ${formatDate(drawnAt)}`
                    : formatDate(createdAt)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {!editing && variant === "pending" && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
            >
              <RiEditLine className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <RiDeleteBinLine className="text-sm" />
            </button>
          </div>
        )}

        {/* Delete for drawn tasks */}
        {!editing && variant === "drawn" && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <RiDeleteBinLine className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
