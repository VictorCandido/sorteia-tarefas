import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Roulette",
  description: "Sorteie suas tarefas e deixe o destino decidir o que fazer.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#3d3730",
              color: "#f3f1ed",
              fontFamily: '"DM Sans", sans-serif',
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
