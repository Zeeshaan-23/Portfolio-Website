import type { Metadata } from "next";
import { Special_Elite, JetBrains_Mono, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
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

const pixelFont = localFont({
  src: "../public/fonts/FirenzeSerifPixel.woff2",
  variable: "--font-pixel",
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  display: "swap",
});

const minecraftFont = localFont({
  src: "../public/fonts/Minecraft.ttf",
  variable: "--font-minecraft",
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
      <body
        className={`${specialElite.variable} ${jetbrainsMono.variable} ${pixelFont.variable} ${pixelifySans.variable} ${minecraftFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
