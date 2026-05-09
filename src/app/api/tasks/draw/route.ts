import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const pendingTasks = await prisma.task.findMany({
    where: { status: "PENDING" },
  });

  if (pendingTasks.length === 0) {
    return NextResponse.json({ error: "No pending tasks to draw" }, { status: 400 });
  }

  const randomIndex = Math.floor(Math.random() * pendingTasks.length);
  const chosen = pendingTasks[randomIndex];

  const updatedTask = await prisma.task.update({
    where: { id: chosen.id },
    data: {
      status: "DRAWN",
      drawnAt: new Date(),
    },
  });

  return NextResponse.json(updatedTask);
}
