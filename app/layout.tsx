import type { Metadata } from "next";
import { Geist, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FoodPanada — Where Every Meal Becomes a Memory",
  description:
    "Seasonal ingredients, open fire, honest cooking. Browse our curated menu, order online, and experience exceptional dining delivered to your door.",
  keywords: ["food ordering", "restaurant", "delivery", "fine dining", "FoodPanada"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
