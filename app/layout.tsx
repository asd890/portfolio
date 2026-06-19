import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Cursor from "@/components/ui/Cursor";
import { NavColorProvider } from "@/contexts/NavColorContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});


export const metadata: Metadata = {
  title: "Portfolio — UX/UI Designer",
  description:
    "UX/UI Designer with 8+ years of experience creating digital products, marketing campaigns, and visual experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <NavColorProvider>
          <SmoothScrollProvider>
            <Cursor />
            {children}
          </SmoothScrollProvider>
        </NavColorProvider>
      </body>
    </html>
  );
}
