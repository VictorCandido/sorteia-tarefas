import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/lib/types";

const pendingTask = {
  id: "task-1",
  title: "Lavar a louça",
  status: "PENDING" as const,
  createdAt: "2024-01-01T00:00:00.000Z",
  drawnAt: null,
};

const drawnTask = {
  id: "task-2",
  title: "Passar roupa",
  status: "DRAWN" as const,
  createdAt: "2024-01-01T00:00:00.000Z",
  drawnAt: "2024-01-02T00:00:00.000Z",
};

function mockFetch(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useTasks — estado inicial", () => {
  it("começa com listas vazias e loading true", () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any);

    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);
    expect(result.current.pendingTasks).toEqual([]);
    expect(result.current.drawnTasks).toEqual([]);
  });

  it("carrega tarefas pendentes e sorteadas ao montar", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([drawnTask]) as any);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.pendingTasks).toEqual([pendingTask]);
    expect(result.current.drawnTasks).toEqual([drawnTask]);
  });

  it("define loading como false mesmo quando fetch retorna vazio", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe("useTasks — addTask", () => {
  it("adiciona tarefa à lista de pendentes", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch(pendingTask, true, 201) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let added: Task | null = null;
    await act(async () => {
      added = await result.current.addTask("Lavar a louça");
    });

    expect(added).toEqual(pendingTask);
    expect(result.current.pendingTasks).toContainEqual(pendingTask);
  });

  it("retorna null quando a API falha", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch({}, false, 400) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let added: Task | null = null;
    await act(async () => {
      added = await result.current.addTask("Título inválido");
    });

    expect(added).toBeNull();
    expect(result.current.pendingTasks).toHaveLength(0);
  });

  it("retorna null quando fetch lança exceção", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let added: Task | null = null;
    await act(async () => {
      added = await result.current.addTask("Tarefa");
    });

    expect(added).toBeNull();
  });
});

describe("useTasks — updateTask", () => {
  it("atualiza tarefa na lista de pendentes", async () => {
    const updated = { ...pendingTask, title: "Secar a louça" };
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch(updated) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = false;
    await act(async () => {
      success = await result.current.updateTask("task-1", "Secar a louça");
    });

    expect(success).toBe(true);
    expect(result.current.pendingTasks[0].title).toBe("Secar a louça");
  });

  it("retorna false quando a API falha", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch({}, false, 404) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.updateTask("task-1", "Novo título");
    });

    expect(success).toBe(false);
    expect(result.current.pendingTasks[0].title).toBe("Lavar a louça");
  });
});

describe("useTasks — deleteTask", () => {
  it("remove tarefa da lista de pendentes", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch({ success: true }) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteTask("task-1");
    });

    expect(result.current.pendingTasks).toHaveLength(0);
  });

  it("remove tarefa da lista de sorteadas", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([drawnTask]) as any)
      .mockResolvedValueOnce(mockFetch({ success: true }) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteTask("task-2");
    });

    expect(result.current.drawnTasks).toHaveLength(0);
  });

  it("retorna false quando a API falha", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch({}, false, 404) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.deleteTask("task-1");
    });

    expect(success).toBe(false);
    expect(result.current.pendingTasks).toHaveLength(1);
  });
});

describe("useTasks — drawTask", () => {
  it("move tarefa de pendentes para sorteadas", async () => {
    const drawn = { ...pendingTask, status: "DRAWN" as const, drawnAt: "2024-01-02T00:00:00.000Z" };
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch(drawn) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let task: Task | null = null;
    await act(async () => {
      task = await result.current.drawTask();
    });

    expect(task).toEqual(drawn);
    expect(result.current.pendingTasks).toHaveLength(0);
    expect(result.current.drawnTasks).toContainEqual(drawn);
  });

  it("retorna null quando a API falha", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([pendingTask]) as any)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch({}, false, 400) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let task = null;
    await act(async () => {
      task = await result.current.drawTask();
    });

    expect(task).toBeNull();
    expect(result.current.pendingTasks).toHaveLength(1);
  });
});

describe("useTasks — undrawTask", () => {
  it("reverte tarefa sorteada para pendentes", async () => {
    const reverted = { ...drawnTask, status: "PENDING" as const, drawnAt: null };
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([drawnTask]) as any)
      .mockResolvedValueOnce(mockFetch(reverted) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = false;
    await act(async () => {
      success = await result.current.undrawTask(drawnTask);
    });

    expect(success).toBe(true);
    expect(result.current.drawnTasks).toHaveLength(0);
    expect(result.current.pendingTasks).toContainEqual(reverted);
  });

  it("retorna false quando a API falha", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([drawnTask]) as any)
      .mockResolvedValueOnce(mockFetch({}, false, 404) as any);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.undrawTask(drawnTask);
    });

    expect(success).toBe(false);
    expect(result.current.drawnTasks).toHaveLength(1);
  });

  it("retorna false quando fetch lança exceção", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockFetch([]) as any)
      .mockResolvedValueOnce(mockFetch([drawnTask]) as any)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success = true;
    await act(async () => {
      success = await result.current.undrawTask(drawnTask);
    });

    expect(success).toBe(false);
  });
});
