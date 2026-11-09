import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vigil — alertas de intrusión sin cámaras",
  description:
    "Sistema de alerta de intrusión que escala por una cadena de contactos de confianza, sin grabar tu casa.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/contacts", label: "Contactos" },
  { href: "/log", label: "Historial" },
  { href: "/research", label: "Investigación" },
  { href: "/product", label: "Producto" },
  { href: "/pricing", label: "Precios" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // El style inline es a proposito: globals.css trae el tema claro de
    // shadcn (:root { color-scheme: light }) y sin esto los <select> y los
    // inputs salen con chrome claro sobre fondo oscuro.
    <html lang="es" style={{ colorScheme: "dark", background: "#0a0a0a" }}>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <nav className="border-b border-neutral-800">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 px-4 py-3">
            <Link href="/" className="mr-4 font-medium tracking-tight">
              Vigil
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-1.5 text-sm text-neutral-400 transition hover:bg-neutral-900 hover:text-neutral-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>

        <footer className="mx-auto max-w-4xl px-4 pb-10 pt-4 text-xs text-neutral-600">
          Demo estudiantil. Las notificaciones son simuladas y no se envían a
          nadie. Vigil no contacta servicios de emergencia automáticamente.
        </footer>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
