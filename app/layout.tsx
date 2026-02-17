import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DegreePath",
    template: "%s",
  },
  description: "Study abroad guides, checklists, and timelines",
  applicationName: "DegreePath",
  keywords: ["study abroad", "Germany", "IELTS", "APS", "visa", "application"],
  openGraph: {
    title: "DegreePath",
    description: "Study abroad guides, checklists, and timelines",
    type: "website",
    siteName: "DegreePath",
  },
  twitter: {
    card: "summary_large_image",
    title: "DegreePath",
    description: "Study abroad guides, checklists, and timelines",
  },
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
