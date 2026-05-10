import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

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

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { usePathname } from "next/navigation";

describe("Header", () => {
  it("exibe o link Tarefas", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByText("Tarefas")).toBeInTheDocument();
  });

  it("exibe o link Sorteadas", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByText("Sorteadas")).toBeInTheDocument();
  });

  it("exibe a marca sorteiatarefa", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByText("tarefa")).toBeInTheDocument();
  });

  it("link Tarefas aponta para /", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    const link = screen.getByRole("link", { name: /tarefas/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("link Sorteadas aponta para /history", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    const link = screen.getByRole("link", { name: /sorteadas/i });
    expect(link).toHaveAttribute("href", "/history");
  });

  it("link Tarefas tem estilo ativo quando pathname é /", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByText("Tarefas")).toHaveClass("text-surface-100");
  });

  it("link Sorteadas tem estilo ativo quando pathname é /history", () => {
    vi.mocked(usePathname).mockReturnValue("/history");
    render(<Header />);
    expect(screen.getByText("Sorteadas")).toHaveClass("text-surface-100");
  });

  it("link inativo tem estilo menos destacado", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByText("Sorteadas")).toHaveClass("text-surface-400");
  });
});
