"use client";

import { AnimatePresence } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";
import { RiHistoryLine, RiLoader4Line } from "react-icons/ri";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { drawnTasks, loading, deleteTask } = useTasks();

  const handleDelete = async (id: string) => {
    const success = await deleteTask(id);
    if (success) toast.success("Removida do histórico!");
    else toast.error("Erro ao remover");
    return success;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-800/60" />
          <span className="text-xs font-display font-bold text-surface-500 uppercase tracking-widest">
            Já Sorteadas
          </span>
          <div className="flex-1 h-px bg-surface-800/60" />
        </div>

        {/* Drawn tasks */}
        {loading ? (
          <div className="flex justify-center py-16">
            <RiLoader4Line className="text-2xl text-surface-500 animate-spin" />
          </div>
        ) : drawnTasks.length === 0 ? (
          <EmptyState
            icon={RiHistoryLine}
            title="Nada sorteado ainda"
            description="Quando você sortear uma tarefa, ela aparecerá aqui."
          />
        ) : (
          <>
            <p className="text-sm text-surface-400 text-center">
              {drawnTasks.length} tarefa{drawnTasks.length !== 1 ? "s" : ""} sorteada{drawnTasks.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {drawnTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    createdAt={task.createdAt}
                    drawnAt={task.drawnAt}
                    index={i}
                    variant="drawn"
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
