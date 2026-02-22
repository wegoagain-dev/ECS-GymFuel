import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "GymFuel",
  description: "Smart meal planning & grocery management for gym-goers",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Clash Display - Bold, athletic display font */}
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,500,400&display=swap" rel="stylesheet" />
        {/* Satoshi - Clean, modern body font */}
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap" rel="stylesheet" />
        {/* JetBrains Mono - For numbers and data */}
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Satoshi', system-ui, sans-serif; }
          h1, h2, h3 { font-family: 'Clash Display', 'Satoshi', system-ui, sans-serif; font-weight: 600; }
          .font-mono, code { font-family: 'JetBrains Mono', monospace; }
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
