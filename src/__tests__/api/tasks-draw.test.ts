import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/tasks/draw/route";

const pendingTask1 = {
  id: "task-1",
  title: "Lavar a louça",
  status: "PENDING" as const,
  createdAt: new Date("2024-01-01"),
  drawnAt: null,
};

const pendingTask2 = {
  id: "task-2",
  title: "Passar roupa",
  status: "PENDING" as const,
  createdAt: new Date("2024-01-02"),
  drawnAt: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("POST /api/tasks/draw", () => {
  it("retorna 400 quando não há tarefas pendentes", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([]);

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("No pending tasks to draw");
    expect(vi.mocked(prisma.task.update)).not.toHaveBeenCalled();
  });

  it("sorteia uma tarefa e atualiza status para DRAWN", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([pendingTask1]);
    const drawnTask = { ...pendingTask1, status: "DRAWN" as const, drawnAt: new Date() };
    vi.mocked(prisma.task.update).mockResolvedValue(drawnTask);

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("task-1");
    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: expect.objectContaining({ status: "DRAWN", drawnAt: expect.any(Date) }),
    });
  });

  it("seleciona a primeira tarefa quando Math.random retorna 0", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    vi.mocked(prisma.task.findMany).mockResolvedValue([pendingTask1, pendingTask2]);
    vi.mocked(prisma.task.update).mockResolvedValue({
      ...pendingTask1,
      status: "DRAWN" as const,
      drawnAt: new Date(),
    });

    await POST();

    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "task-1" } })
    );
  });

  it("seleciona a última tarefa quando Math.random retorna valor próximo de 1", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    vi.mocked(prisma.task.findMany).mockResolvedValue([pendingTask1, pendingTask2]);
    vi.mocked(prisma.task.update).mockResolvedValue({
      ...pendingTask2,
      status: "DRAWN" as const,
      drawnAt: new Date(),
    });

    await POST();

    expect(vi.mocked(prisma.task.update)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "task-2" } })
    );
  });

  it("define drawnAt como data atual", async () => {
    const before = new Date();
    vi.mocked(prisma.task.findMany).mockResolvedValue([pendingTask1]);
    vi.mocked(prisma.task.update).mockResolvedValue({
      ...pendingTask1,
      status: "DRAWN" as const,
      drawnAt: new Date(),
    });

    await POST();

    const updateCall = vi.mocked(prisma.task.update).mock.calls[0][0];
    const drawnAt = updateCall.data.drawnAt as Date;
    expect(drawnAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });
});
