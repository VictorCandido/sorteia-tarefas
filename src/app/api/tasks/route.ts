import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where = status === "DRAWN" ? { status: "DRAWN" as const } : status === "PENDING" ? { status: "PENDING" as const } : {};

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (title.trim().length > 200) {
    return NextResponse.json({ error: "Title too long (max 200 chars)" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { title: title.trim() },
  });

  return NextResponse.json(task, { status: 201 });
}
