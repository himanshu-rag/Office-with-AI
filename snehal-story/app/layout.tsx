import type { Metadata } from "next";
import { Playfair_Display, Outfit, Alex_Brush } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-handwriting",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Love Story - Happy Girlfriend's Day",
  description: "A cinematic experience for Snehal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${outfit.variable} ${alexBrush.variable} antialiased bg-bg-dark text-accent-light`}
      >
        <div className="aurora-bg" />
        {children}
      </body>
    </html>
  );
}
