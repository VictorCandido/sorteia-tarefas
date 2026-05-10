import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { PUT, PATCH, DELETE } from "@/app/api/tasks/[id]/route";

const params = { params: { id: "task-1" } };

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

describe("PUT /api/tasks/[id]", () => {
  it("atualiza o título e retorna a tarefa", async () => {
    const updated = { ...mockTask, title: "Passar roupa" };
    vi.mocked(prisma.task.update).mockResolvedValue(updated);

    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "PUT",
      body: JSON.stringify({ title: "Passar roupa" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Passar roupa");
    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { title: "Passar roupa" },
    });
  });

  it("faz trim do título antes de salvar", async () => {
    vi.mocked(prisma.task.update).mockResolvedValue(mockTask);

    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "PUT",
      body: JSON.stringify({ title: "  Novo título  " }),
      headers: { "Content-Type": "application/json" },
    });
    await PUT(req, params);

    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { title: "Novo título" },
    });
  });

  it("rejeita título vazio com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "PUT",
      body: JSON.stringify({ title: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(400);
    expect(vi.mocked(prisma.task.update)).not.toHaveBeenCalled();
  });

  it("rejeita título somente com espaços com 400", async () => {
    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "PUT",
      body: JSON.stringify({ title: "   " }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(400);
  });

  it("retorna 404 para ID inexistente", async () => {
    vi.mocked(prisma.task.update).mockRejectedValue(new Error("Not found"));

    const req = new NextRequest("http://localhost/api/tasks/inexistente", {
      method: "PUT",
      body: JSON.stringify({ title: "Título" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params: { id: "inexistente" } });

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/tasks/[id]", () => {
  it("reverte tarefa para PENDING e limpa drawnAt", async () => {
    const reverted = { ...mockTask, status: "PENDING" as const, drawnAt: null };
    vi.mocked(prisma.task.update).mockResolvedValue(reverted);

    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "PATCH",
    });
    const res = await PATCH(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("PENDING");
    expect(data.drawnAt).toBeNull();
    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { status: "PENDING", drawnAt: null },
    });
  });

  it("retorna 404 para ID inexistente", async () => {
    vi.mocked(prisma.task.update).mockRejectedValue(new Error("Not found"));

    const req = new NextRequest("http://localhost/api/tasks/inexistente", {
      method: "PATCH",
    });
    const res = await PATCH(req, { params: { id: "inexistente" } });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/tasks/[id]", () => {
  it("remove a tarefa e retorna success", async () => {
    vi.mocked(prisma.task.delete).mockResolvedValue(mockTask);

    const req = new NextRequest("http://localhost/api/tasks/task-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(vi.mocked(prisma.task.delete)).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
  });

  it("retorna 404 para ID inexistente", async () => {
    vi.mocked(prisma.task.delete).mockRejectedValue(new Error("Not found"));

    const req = new NextRequest("http://localhost/api/tasks/inexistente", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: { id: "inexistente" } });

    expect(res.status).toBe(404);
  });
});
