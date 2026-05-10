"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/lib/types";

export function useTasks() {
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [drawnTasks, setDrawnTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const [pendingRes, drawnRes] = await Promise.all([
        fetch("/api/tasks?status=PENDING"),
        fetch("/api/tasks?status=DRAWN"),
      ]);
      const pending = await pendingRes.json();
      const drawn = await drawnRes.json();
      setPendingTasks(pending);
      setDrawnTasks(drawn);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string): Promise<Task | null> => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return null;
      const task = await res.json();
      setPendingTasks((prev) => [task, ...prev]);
      return task;
    } catch {
      return null;
    }
  };

  const updateTask = async (id: string, title: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return false;
      const updated = await res.json();
      setPendingTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch {
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      setPendingTasks((prev) => prev.filter((t) => t.id !== id));
      setDrawnTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  const drawTask = async (): Promise<Task | null> => {
    try {
      const res = await fetch("/api/tasks/draw", { method: "POST" });
      if (!res.ok) return null;
      const drawn = await res.json();
      setPendingTasks((prev) => prev.filter((t) => t.id !== drawn.id));
      setDrawnTasks((prev) => [drawn, ...prev]);
      return drawn;
    } catch {
      return null;
    }
  };

  const undrawTask = async (task: Task): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "PATCH" });
      if (!res.ok) return false;
      const reverted = await res.json();
      setDrawnTasks((prev) => prev.filter((t) => t.id !== task.id));
      setPendingTasks((prev) => [reverted, ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  return {
    pendingTasks,
    drawnTasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    drawTask,
    undrawTask,
    refetch: fetchTasks,
  };
}
