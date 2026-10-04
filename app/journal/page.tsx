import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/journalStore";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides to wearing, matching, gifting and caring for cufflinks, from SANWARNA.",
};

export default async function JournalPage() {
  const articles = await getArticles();
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
      <h1 className="font-display text-4xl text-graphite">Journal</h1>
      <p className="mt-4 text-lg text-graphite/70">Short guides to wearing, matching and caring for your cufflinks.</p>
      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/journal/${a.slug}`} className="group flex items-center gap-5 py-6 md:gap-8">
              {a.image && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-hairline bg-cloud md:h-36 md:w-48">
                  <Image src={a.image} alt="" fill sizes="(max-width: 768px) 96px, 192px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <div>
                <h2 className="font-display text-xl text-graphite group-hover:text-champagne md:text-2xl">{a.title}</h2>
                <p className="mt-2 text-sm text-graphite/65 md:text-base">{a.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
