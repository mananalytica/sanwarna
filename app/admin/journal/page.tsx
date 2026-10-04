import Link from "next/link";
import { canEditJournal, listArticlesForAdmin } from "@/lib/journalStore";
import { imageUrl } from "@/lib/cloudinary";
import imageLoader from "@/lib/imageLoader";

export const dynamic = "force-dynamic";

export default async function AdminJournal({ searchParams }: { searchParams: { saved?: string; deleted?: string } }) {
  const editable = canEditJournal();
  let articles: Awaited<ReturnType<typeof listArticlesForAdmin>> = [];
  let failed = false;
  try {
    articles = await listArticlesForAdmin();
  } catch (err) {
    console.error("[admin] could not load journal", err);
    failed = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-graphite">Journal</h1>
        {editable && !failed && (
          <Link href="/admin/journal/new" className="rounded-full bg-graphite px-6 py-2.5 text-sm font-medium text-paper hover:bg-champagne">
            Add article
          </Link>
        )}
      </div>
      {searchParams.saved && <p role="status" className="mt-4 text-sm text-graphite">Article saved. It is live on the site now.</p>}
      {searchParams.deleted && <p role="status" className="mt-4 text-sm text-graphite">Article deleted.</p>}
      {!editable && <p className="mt-4 text-sm text-rust">No database is connected, so articles can&apos;t be edited here. Set MOTHERDUCK_TOKEN in Vercel and redeploy.</p>}
      {failed && <p className="mt-4 text-sm text-rust">Articles could not be loaded from MotherDuck. Please try again.</p>}

      <ul className="mt-8 divide-y divide-hairline rounded-xl border border-hairline">
        {articles.map((a) => (
          <li key={a.slug} className="flex items-center gap-4 px-4 py-3">
            {a.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageLoader({ src: imageUrl(a.image), width: 320 })} alt="" className="h-12 w-16 shrink-0 rounded-lg border border-hairline object-cover" />
            ) : (
              <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-hairline text-[10px] text-steel">No image</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-graphite">{a.title}</p>
              <p className="truncate text-xs text-steel">{a.summary}</p>
            </div>
            {editable && (
              <Link href={`/admin/journal/${a.slug}`} className="text-sm text-champagne underline-offset-4 hover:underline">Edit</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
