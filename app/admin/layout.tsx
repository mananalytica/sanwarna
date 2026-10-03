import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";
import { logoutAction } from "./actions";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value);
  return (
    <div>
      {signedIn && (
        <nav aria-label="Admin" className="border-b border-hairline bg-mist">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 text-sm md:px-8">
            <span className="font-medium text-graphite">Admin</span>
            <Link href="/admin/products" className="text-steel hover:text-graphite">Products</Link>
            <Link href="/admin/orders" className="text-steel hover:text-graphite">Orders</Link>
            <Link href="/video-studio" className="text-steel hover:text-graphite">Video Studio</Link>
            <Link href="/api/products/feed.xml" className="text-steel hover:text-graphite">Product feed</Link>
            <form action={logoutAction} className="ml-auto">
              <button type="submit" className="text-steel hover:text-graphite">Sign out</button>
            </form>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
