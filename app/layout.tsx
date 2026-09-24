import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AppShell from "@/components/layout/AppShell";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ayutrika Herbals — Luxury Ayurvedic & Botanical Wellness",
    template: "%s | Ayutrika Herbals",
  },
  description:
    "Ayutrika Herbals is a premium herbal wellness brand offering thoughtfully presented botanical and natural products inspired by the richness of nature.",
  keywords: [
    "Ayutrika Herbals",
    "Ayurvedic products",
    "luxury herbal e-commerce",
    "organic ashwagandha",
    "kumkumadi tailam",
    "botanical wellness",
    "herbal tea rituals",
    "natural skincare",
  ],
  authors: [{ name: "Ayutrika Herbals" }],
  creator: "Ayutrika Herbals",
  publisher: "Ayutrika Herbals",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ayutrika-herbals.vercel.app",
    title: "Ayutrika Herbals — Luxury Ayurvedic & Botanical Wellness",
    description:
      "Ayutrika Herbals is a premium herbal wellness brand offering thoughtfully presented botanical and natural products inspired by the richness of nature.",
    siteName: "Ayutrika Herbals",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Ayutrika Herbals Luxury Botanical Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayutrika Herbals — Luxury Ayurvedic & Botanical Wellness",
    description:
      "Pure botanical formulations crafted for modern wellness rituals. Rooted in nature. Crafted with care.",
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-forest-950 text-ivory-100 antialiased selection:bg-forest-800 selection:text-gold-400">
        <ToastProvider>
          <CustomerAuthProvider>
            <WishlistProvider>
              <CartProvider>
                <AppShell>{children}</AppShell>
              </CartProvider>
            </WishlistProvider>
          </CustomerAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
