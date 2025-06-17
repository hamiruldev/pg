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
  title: "Public Gold",
  description: "All prices are quoted in Malaysia Ringgit (MYR) and excluding Gold Premium",
  keywords: "Publicgold, Publigoldofficial, PG Mall, PG Jewel, Aurora Italia, Emas, GAP, EPP, public gold, public gold malaysia, public gold indonesia, public gold brunei, public gold ampang, public gold bangi, public gold sunway, emas, emas public gold, dinar, gold bar, gold bars, gap, public gold gap",
  openGraph: {
    title: "Public Gold Malaysia - All prices are quoted in Malaysia Ringgit (MYR) and excluding Gold Premium",
    images: ["https://publicgoldofficial.com/img/shariah.jpg"],
    url: "https://publicgoldofficial.com/image/kelebihan/kelebihan11.jpg",
    type: "article",
    description: "All prices are quoted in Malaysia Ringgit (MYR) and excluding Gold Premium",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
