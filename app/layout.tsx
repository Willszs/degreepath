import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DegreePath",
  description: "Study abroad guides, checklists, and timelines",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const lang = requestHeaders.get("x-degreepath-lang") === "en" ? "en" : "zh";

  return (
    <html lang={lang}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
