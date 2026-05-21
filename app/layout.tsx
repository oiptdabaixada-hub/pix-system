import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexPay - Sistema de Pagamento via PIX",
  description:
    "Plataforma premium para geração de cobranças PIX rápidas, seguras e automatizadas.",

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },

  openGraph: {
    title: "NexPay",
    description:
      "Sistema premium de pagamentos via PIX.",
    url: "https://www.nexpay.fun",
    siteName: "NexPay",
    locale: "pt_BR",
    type: "website",
  },

  metadataBase: new URL("https://www.nexpay.fun"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}