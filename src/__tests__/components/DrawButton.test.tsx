import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DrawButton from "@/components/DrawButton";

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

describe("DrawButton", () => {
  it("exibe 'Sem tarefas' quando desabilitado", () => {
    render(<DrawButton onClick={vi.fn()} disabled spinning={false} taskCount={0} />);
    expect(screen.getByText("Sem tarefas")).toBeInTheDocument();
  });

  it("exibe 'Sortear' quando habilitado", () => {
    render(<DrawButton onClick={vi.fn()} disabled={false} spinning={false} taskCount={3} />);
    expect(screen.getByText("Sortear")).toBeInTheDocument();
  });

  it("exibe 'Sorteando...' durante o sorteio", () => {
    render(<DrawButton onClick={vi.fn()} disabled={false} spinning taskCount={3} />);
    expect(screen.getByText("Sorteando...")).toBeInTheDocument();
  });

  it("exibe contagem de tarefas no plural", () => {
    render(<DrawButton onClick={vi.fn()} disabled={false} spinning={false} taskCount={5} />);
    expect(screen.getByText("5 tarefas pendentes")).toBeInTheDocument();
  });

  it("exibe contagem no singular com 1 tarefa", () => {
    render(<DrawButton onClick={vi.fn()} disabled={false} spinning={false} taskCount={1} />);
    expect(screen.getByText("1 tarefa pendente")).toBeInTheDocument();
  });

  it("não exibe contagem quando desabilitado", () => {
    render(<DrawButton onClick={vi.fn()} disabled spinning={false} taskCount={0} />);
    expect(screen.queryByText(/pendente/)).not.toBeInTheDocument();
  });

  it("chama onClick ao clicar quando habilitado", async () => {
    const onClick = vi.fn();
    render(<DrawButton onClick={onClick} disabled={false} spinning={false} taskCount={2} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("não chama onClick quando desabilitado", async () => {
    const onClick = vi.fn();
    render(<DrawButton onClick={onClick} disabled spinning={false} taskCount={0} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("não chama onClick durante o sorteio", async () => {
    const onClick = vi.fn();
    render(<DrawButton onClick={onClick} disabled={false} spinning taskCount={2} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("botão tem atributo disabled quando disabled=true", () => {
    render(<DrawButton onClick={vi.fn()} disabled spinning={false} taskCount={0} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("botão tem atributo disabled durante o sorteio", () => {
    render(<DrawButton onClick={vi.fn()} disabled={false} spinning taskCount={2} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
