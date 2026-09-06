import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://loveroast.app"),
  title: {
    default: "LoveRoast — We test your love. Then we roast it. 😂❤️",
    template: "%s · LoveRoast",
  },
  description:
    "Compatibility scores, who loves who more, red flags, and full relationship roasts — entertainment only.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "LoveRoast — We test your love. Then we roast it. 😂❤️",
    description:
      "We test your love. Then we roast it. Pure entertainment — zero science.",
    type: "website",
    siteName: "LoveRoast",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveRoast — We test your love. Then we roast it. 😂❤️",
    description: "We test your love. Then we roast it. 😂❤️",
  },
  keywords: [
    "love calculator",
    "relationship roast",
    "red flag detector",
    "funny love test",
    "zodiac compatibility",
    "KBZPay tip",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} h-full`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
