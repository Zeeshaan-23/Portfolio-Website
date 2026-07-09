import type { Metadata } from "next";
import { Special_Elite, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Archive — Digital Antiquity",
  description:
    "A personal portfolio presented as a dim museum gallery at night — classical marble meets digital glitch. Navigate by clicking crumpled paper balls or typing terminal commands.",
  keywords: ["portfolio", "developer", "engineer", "museum", "terminal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${specialElite.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
