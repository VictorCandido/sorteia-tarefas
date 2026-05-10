import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/EmptyState";

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

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("EmptyState", () => {
  it("renderiza o ícone passado via prop", () => {
    render(<EmptyState icon={MockIcon as any} title="Título" description="Descrição" />);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("renderiza o título", () => {
    render(<EmptyState icon={MockIcon as any} title="Nenhuma tarefa" description="Descrição" />);
    expect(screen.getByText("Nenhuma tarefa")).toBeInTheDocument();
  });

  it("renderiza a descrição", () => {
    render(<EmptyState icon={MockIcon as any} title="Título" description="Adicione tarefas acima!" />);
    expect(screen.getByText("Adicione tarefas acima!")).toBeInTheDocument();
  });

  it("renderiza título e descrição simultaneamente", () => {
    render(
      <EmptyState
        icon={MockIcon as any}
        title="Nada sorteado ainda"
        description="Quando você sortear uma tarefa, ela aparecerá aqui."
      />
    );
    expect(screen.getByText("Nada sorteado ainda")).toBeInTheDocument();
    expect(screen.getByText("Quando você sortear uma tarefa, ela aparecerá aqui.")).toBeInTheDocument();
  });
});
