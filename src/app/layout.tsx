import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata = {
  title: "Kasbon",
  description: "Personal Debt Tracker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}