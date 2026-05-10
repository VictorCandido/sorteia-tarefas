import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DrawnModal from "@/components/DrawnModal";
import { Task } from "@/lib/types";

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

const mockTask: Task = {
  id: "task-1",
  title: "Lavar a louça",
  status: "DRAWN",
  createdAt: "2024-01-01T00:00:00.000Z",
  drawnAt: "2024-01-02T00:00:00.000Z",
};

describe("DrawnModal", () => {
  it("não renderiza nada quando task é null", () => {
    const { container } = render(
      <DrawnModal task={null} onClose={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("exibe o título da tarefa sorteada", () => {
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Lavar a louça")).toBeInTheDocument();
  });

  it("exibe o label 'Tarefa Sorteada'", () => {
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Tarefa Sorteada")).toBeInTheDocument();
  });

  it("exibe botão 'Entendido, bora!'", () => {
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /entendido, bora!/i })).toBeInTheDocument();
  });

  it("exibe botão 'Não consigo agora'", () => {
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /não consigo agora/i })).toBeInTheDocument();
  });

  it("chama onClose ao clicar em 'Entendido, bora!'", async () => {
    const onClose = vi.fn();
    render(<DrawnModal task={mockTask} onClose={onClose} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /entendido, bora!/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("chama onCancel ao clicar em 'Não consigo agora'", async () => {
    const onCancel = vi.fn();
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /não consigo agora/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("chama onClose ao clicar no botão X", async () => {
    const onClose = vi.fn();
    render(<DrawnModal task={mockTask} onClose={onClose} onCancel={vi.fn()} />);
    const allButtons = screen.getAllByRole("button");
    const closeBtn = allButtons.find((btn) => !btn.textContent?.trim());
    await userEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("'Entendido, bora!' não chama onCancel", async () => {
    const onCancel = vi.fn();
    render(<DrawnModal task={mockTask} onClose={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /entendido, bora!/i }));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("'Não consigo agora' não chama onClose", async () => {
    const onClose = vi.fn();
    render(<DrawnModal task={mockTask} onClose={onClose} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /não consigo agora/i }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
