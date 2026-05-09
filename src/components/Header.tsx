"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { RiShuffleFill } from "react-icons/ri";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Tarefas" },
    { href: "/history", label: "Sorteadas" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface-950/70 border-b border-surface-800/50">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"
          >
            <RiShuffleFill className="text-accent text-lg" />
          </motion.div>
          <span className="font-display font-bold text-lg tracking-tight">
            task<span className="text-accent">roulette</span>
          </span>
        </Link>

        <nav className="flex gap-1 bg-surface-900/60 rounded-xl p-1 border border-surface-800/40">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors"
            >
              {pathname === link.href && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-surface-800 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  pathname === link.href ? "text-surface-100" : "text-surface-400 hover:text-surface-200"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
