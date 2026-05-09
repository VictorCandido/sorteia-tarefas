"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Task } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";
import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import DrawButton from "@/components/DrawButton";
import DrawnModal from "@/components/DrawnModal";
import EmptyState from "@/components/EmptyState";
import { RiInboxLine, RiLoader4Line } from "react-icons/ri";

export default function HomePage() {
  const { pendingTasks, loading, addTask, updateTask, deleteTask, drawTask } = useTasks();
  const [spinning, setSpinning] = useState(false);
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);

  const handleAdd = async (title: string) => {
    const task = await addTask(title);
    if (task) {
      toast.success("Tarefa adicionada!");
      return true;
    }
    toast.error("Erro ao adicionar tarefa");
    return false;
  };

  const handleUpdate = async (id: string, title: string) => {
    const success = await updateTask(id, title);
    if (success) toast.success("Tarefa atualizada!");
    else toast.error("Erro ao atualizar");
    return success;
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTask(id);
    if (success) toast.success("Tarefa removida!");
    else toast.error("Erro ao remover");
    return success;
  };

  const handleDraw = async () => {
    setSpinning(true);

    // Suspense animation — wait at least 1.5s for dramatic effect
    const [task] = await Promise.all([
      drawTask(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);

    setSpinning(false);

    if (task) {
      setDrawnTask(task);
    } else {
      toast.error("Erro ao sortear tarefa");
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Form */}
        <TaskForm onAdd={handleAdd} />

        {/* Draw button */}
        <DrawButton
          onClick={handleDraw}
          disabled={pendingTasks.length === 0}
          spinning={spinning}
          taskCount={pendingTasks.length}
        />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-800/60" />
          <span className="text-xs font-display font-bold text-surface-500 uppercase tracking-widest">
            Pendentes
          </span>
          <div className="flex-1 h-px bg-surface-800/60" />
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <RiLoader4Line className="text-2xl text-surface-500 animate-spin" />
          </div>
        ) : pendingTasks.length === 0 ? (
          <EmptyState
            icon={RiInboxLine}
            title="Nenhuma tarefa ainda"
            description="Adicione tarefas acima e sorteie quando estiver pronto!"
          />
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {pendingTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  createdAt={task.createdAt}
                  index={i}
                  variant="pending"
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Drawn modal */}
      <DrawnModal task={drawnTask} onClose={() => setDrawnTask(null)} />
    </div>
  );
}
