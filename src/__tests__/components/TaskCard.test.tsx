import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskCard from "@/components/TaskCard";

vi.mock("framer-motion", async () => {
  const { createElement } = await import("react");
  const cache: Record<string, any> = {};
  return {
    motion: new Proxy({} as Record<string, unknown>, {
      get: (_, el: string) => {
        if (!cache[el]) {
          cache[el] = ({
            children,
            animate, initial, exit, transition,
            whileHover, whileTap, layout, layoutId,
            variants, custom, onAnimationComplete,
            ...props
          }: any) => createElement(el, props, children);
          cache[el].displayName = `motion.${el}`;
        }
        return cache[el];
      },
    }),
    AnimatePresence: ({ children }: any) => children ?? null,
  };
});

const baseProps = {
  id: "task-1",
  title: "Lavar a louça",
  createdAt: "2024-01-15T10:30:00.000Z",
  index: 0,
};

describe("TaskCard — variante pending", () => {
  it("exibe o título da tarefa", () => {
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Lavar a louça")).toBeInTheDocument();
  });

  it("exibe dois botões (editar e deletar)", () => {
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("clique em editar exibe input com valor atual", async () => {
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={vi.fn()} />);
    const [editBtn] = screen.getAllByRole("button");
    await userEvent.click(editBtn);
    expect(screen.getByRole("textbox")).toHaveValue("Lavar a louça");
  });

  it("salvar edição com Enter chama onUpdate com novo valor", async () => {
    const onUpdate = vi.fn().mockResolvedValue(true);
    render(<TaskCard {...baseProps} variant="pending" onUpdate={onUpdate} onDelete={vi.fn()} />);
    const [editBtn] = screen.getAllByRole("button");
    await userEvent.click(editBtn);
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "Lavar e secar{Enter}");
    expect(onUpdate).toHaveBeenCalledWith("task-1", "Lavar e secar");
  });

  it("cancelar edição com Escape restaura o título original", async () => {
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={vi.fn()} />);
    const [editBtn] = screen.getAllByRole("button");
    await userEvent.click(editBtn);
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "Texto cancelado");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByText("Lavar a louça")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("clique em deletar chama onDelete com o id da tarefa", async () => {
    const onDelete = vi.fn().mockResolvedValue(true);
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={onDelete} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[1]);
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });

  it("não chama onUpdate quando o título não mudou", async () => {
    const onUpdate = vi.fn().mockResolvedValue(true);
    render(<TaskCard {...baseProps} variant="pending" onUpdate={onUpdate} onDelete={vi.fn()} />);
    const [editBtn] = screen.getAllByRole("button");
    await userEvent.click(editBtn);
    await userEvent.keyboard("{Enter}");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("exibe data de criação", () => {
    render(<TaskCard {...baseProps} variant="pending" onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/jan\./i)).toBeInTheDocument();
  });
});

describe("TaskCard — variante drawn", () => {
  it("exibe o título da tarefa sorteada", () => {
    render(
      <TaskCard
        {...baseProps}
        variant="drawn"
        drawnAt="2024-01-16T14:00:00.000Z"
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("Lavar a louça")).toBeInTheDocument();
  });

  it("exibe data de sorteio com label 'Sorteada em'", () => {
    render(
      <TaskCard
        {...baseProps}
        variant="drawn"
        drawnAt="2024-01-16T14:00:00.000Z"
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/Sorteada em/)).toBeInTheDocument();
  });

  it("exibe apenas um botão (deletar, sem editar)", () => {
    render(
      <TaskCard
        {...baseProps}
        variant="drawn"
        drawnAt="2024-01-16T14:00:00.000Z"
        onDelete={vi.fn()}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("clique em deletar chama onDelete com o id da tarefa", async () => {
    const onDelete = vi.fn().mockResolvedValue(true);
    render(
      <TaskCard
        {...baseProps}
        variant="drawn"
        drawnAt="2024-01-16T14:00:00.000Z"
        onDelete={onDelete}
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});
