import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "@/components/TaskForm";

// Cached mock: same function reference per element type across renders,
// preventing React from unmounting/remounting the form on every state change.
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

describe("TaskForm", () => {
  it("botão Adicionar está desabilitado com input vazio", () => {
    render(<TaskForm onAdd={vi.fn()} />);
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeDisabled();
  });

  it("botão Adicionar fica habilitado ao digitar texto", async () => {
    render(<TaskForm onAdd={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Nova tarefa..."), "Minha tarefa");
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeEnabled();
  });

  it("exibe contador de caracteres ao digitar", async () => {
    render(<TaskForm onAdd={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Nova tarefa..."), "Oi");
    expect(screen.getByText(/2\/200/)).toBeInTheDocument();
  });

  it("não exibe contador quando input está vazio", () => {
    render(<TaskForm onAdd={vi.fn()} />);
    expect(screen.queryByText(/\/200/)).not.toBeInTheDocument();
  });

  it("chama onAdd com o valor do input ao clicar Adicionar", async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Nova tarefa..."), "Lavar a louça");
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(onAdd).toHaveBeenCalledWith("Lavar a louça");
  });

  it("chama onAdd ao pressionar Enter no input", async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Nova tarefa..."), "Tarefa via Enter{Enter}");
    expect(onAdd).toHaveBeenCalledWith("Tarefa via Enter");
  });

  it("limpa o input após submit bem-sucedido", async () => {
    const onAdd = vi.fn().mockResolvedValue(true);
    render(<TaskForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText("Nova tarefa...");
    await userEvent.type(input, "Tarefa nova");
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(input).toHaveValue("");
  });

  it("mantém o input após submit com falha", async () => {
    const onAdd = vi.fn().mockResolvedValue(false);
    render(<TaskForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText("Nova tarefa...");
    await userEvent.type(input, "Tarefa com erro");
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(input).toHaveValue("Tarefa com erro");
  });

  it("não chama onAdd com input vazio", async () => {
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("não chama onAdd com input somente espaços", async () => {
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);
    const input = screen.getByPlaceholderText("Nova tarefa...");
    await userEvent.type(input, "   ");
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
