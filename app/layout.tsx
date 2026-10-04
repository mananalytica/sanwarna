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
    default: "SANWARNA | Beauty in Every Detail",
    template: "%s · SANWARNA",
  },
  description:
    "SANWARNA: beauty in every detail. Statement jewellery and accessories, starting with crystal cufflinks for men. Free delivery across Pakistan, Cash on Delivery.",
  keywords: [
    "luxury cufflinks Pakistan",
    "cufflinks Pakistan",
    "cufflinks for men",
    "men's accessories Pakistan",
    "wedding cufflinks",
    "barat cufflinks",
    "SANWARNA",
  ],
  openGraph: {
    title: "SANWARNA | Beauty in Every Detail",
    description:
      "Statement jewellery and accessories, starting with crystal cufflinks. Free delivery across Pakistan, Cash on Delivery.",
    siteName: "SANWARNA",
    type: "website",
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
