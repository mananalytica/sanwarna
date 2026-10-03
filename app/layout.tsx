import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { getAllProducts } from "@/lib/getProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsApp";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SANWARNA — Luxury Cufflinks & Tie Pens for Men, Pakistan",
    template: "%s · SANWARNA",
  },
  description:
    "SANWARNA makes luxury cufflinks and tie pens for the modern Pakistani gentleman. Prices in PKR, free delivery across Pakistan, Cash on Delivery.",
  keywords: [
    "luxury cufflinks Pakistan",
    "tie pens Pakistan",
    "men's accessories Pakistan",
    "wedding cufflinks",
    "barat cufflinks",
    "SANWARNA",
  ],
  openGraph: {
    title: "SANWARNA — Luxury Cufflinks & Tie Pens, Pakistan",
    description:
      "Luxury cufflinks and tie pens for the modern Pakistani gentleman. Free delivery and Cash on Delivery.",
    siteName: "SANWARNA",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💠</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getAllProducts();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-paper text-graphite antialiased">
        <ProductsProvider products={products}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:m-3 focus:rounded focus:bg-champagne focus:px-4 focus:py-2 focus:text-graphite"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppFloat />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
