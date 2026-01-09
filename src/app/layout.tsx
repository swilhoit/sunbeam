import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "Sunbeam | Curated Vintage & Mid-Century Furniture",
  description: "Discover timeless design at Sunbeam. Curated vintage and mid-century modern furniture for those who appreciate exceptional craftsmanship and enduring beauty.",
  keywords: ["vintage furniture", "mid-century modern", "furniture store", "Los Angeles", "curated furniture"],
  openGraph: {
    title: "Sunbeam | Curated Vintage & Mid-Century Furniture",
    description: "Discover timeless design at Sunbeam. Curated vintage and mid-century modern furniture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
