import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides to wearing, matching, gifting and caring for cufflinks, from SANWARNA.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <h1 className="font-display text-4xl text-graphite">Journal</h1>
      <p className="mt-4 text-lg text-graphite/70">Short guides to wearing, matching and caring for your cufflinks.</p>
      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={`/journal/${a.slug}`} className="group block py-6">
              <h2 className="font-display text-2xl text-graphite group-hover:text-champagne">{a.title}</h2>
              <p className="mt-2 text-graphite/65">{a.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
