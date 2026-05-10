import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/tasks/route";

const mockTask = {
  id: "task-1",
  title: "Lavar a louça",
  status: "PENDING" as const,
  createdAt: new Date("2024-01-01"),
  drawnAt: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/tasks", () => {
  it("retorna tarefas sem filtro", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([mockTask]);

    const req = new NextRequest("http://localhost/api/tasks");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Lavar a louça");
    expect(vi.mocked(prisma.task.findMany)).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
    });
  });

  it("filtra por status PENDING", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([mockTask]);

    const req = new NextRequest("http://localhost/api/tasks?status=PENDING");
    await GET(req);

    expect(vi.mocked(prisma.task.findMany)).toHaveBeenCalledWith({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("filtra por status DRAWN", async () => {
    const drawnTask = { ...mockTask, status: "DRAWN" as const, drawnAt: new Date() };
    vi.mocked(prisma.task.findMany).mockResolvedValue([drawnTask]);

    const req = new NextRequest("http://localhost/api/tasks?status=DRAWN");
    await GET(req);

    expect(vi.mocked(prisma.task.findMany)).toHaveBeenCalledWith({
      where: { status: "DRAWN" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("retorna lista vazia quando não há tarefas", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([]);

    const req = new NextRequest("http://localhost/api/tasks");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });
});

describe("POST /api/tasks", () => {
  it("cria tarefa com título válido e retorna 201", async () => {
    vi.mocked(prisma.task.create).mockResolvedValue(mockTask);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "Lavar a louça" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.title).toBe("Lavar a louça");
    expect(vi.mocked(prisma.task.create)).toHaveBeenCalledWith({
      data: { title: "Lavar a louça" },
    });
  });

  it("faz trim do título antes de salvar", async () => {
    vi.mocked(prisma.task.create).mockResolvedValue(mockTask);

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "  Lavar a louça  " }),
      headers: { "Content-Type": "application/json" },
    });
    await POST(req);

    expect(vi.mocked(prisma.task.create)).toHaveBeenCalledWith({
      data: { title: "Lavar a louça" },
    });
  });

  it("rejeita título vazio com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(vi.mocked(prisma.task.create)).not.toHaveBeenCalled();
  });

  it("rejeita título somente com espaços com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "   " }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("rejeita título sem campo title com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("rejeita título com mais de 200 caracteres com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "a".repeat(201) }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("aceita título com exatamente 200 caracteres", async () => {
    vi.mocked(prisma.task.create).mockResolvedValue({ ...mockTask, title: "a".repeat(200) });

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "a".repeat(200) }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });
});
