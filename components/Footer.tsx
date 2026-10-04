import Link from "next/link";
import Logo from "./Logo";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-champagne/15 bg-mist">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="text-graphite">
              <Logo className="h-14" />
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite/60">
              Sanwarna — to make yourself beautiful. Cufflinks and tie pens for
              the modern Pakistani gentleman, delivered nationwide with Cash
              on Delivery.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider2 text-champagne/80">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-graphite/70">
              <li><Link href="/shop?category=cufflinks" className="hover:text-champagne">Cufflinks</Link></li>
              <li><Link href="/shop?category=tie-pens" className="hover:text-champagne">Tie Pens</Link></li>
              <li><Link href="/shop?category=sets" className="hover:text-champagne">Gift Sets</Link></li>
              <li><Link href="/shop" className="hover:text-champagne">All Products</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider2 text-champagne/80">Help</p>
            <ul className="mt-4 space-y-2.5 text-sm text-graphite/70">
              <li>
                <a href={whatsappLink("Assalam o Alaikum, I have a question about SANWARNA cufflinks.")} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li><Link href="/cart" className="hover:text-champagne">Your Bag</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider2 text-champagne/80">Stay in the loop</p>
            <p className="mt-4 text-sm text-graphite/60">
              New drops and styling notes, a few times a month.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="hairline-solid my-10" />

        <div className="flex flex-col gap-3 text-xs text-graphite/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SANWARNA · Pakistan. All rights reserved. Prices in PKR.</p>
          <p className="flex items-center gap-4">
            <span>Free delivery across Pakistan. Cash on Delivery available.</span>
            <Link href="/admin/login" className="text-graphite/30 hover:text-champagne">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
