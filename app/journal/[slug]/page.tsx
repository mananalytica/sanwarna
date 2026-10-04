import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/journal";
import PairingTable from "@/components/PairingTable";

export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  return a ? { title: a.title, description: a.summary } : {};
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-14 md:py-20">
      <Link href="/journal" className="text-sm text-steel hover:text-graphite">Journal</Link>
      <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-graphite">{a.title}</h1>

      {a.sections.map((s, i) => (
        <section key={i} className={i === 0 ? "mt-6" : "mt-10"}>
          {s.heading && <h2 className="font-display text-2xl text-graphite">{s.heading}</h2>}
          {s.body?.map((para) => (
            <p key={para} className="mt-4 leading-relaxed text-graphite/75">{para}</p>
          ))}
          {s.list && (
            <ul className="mt-4 space-y-2.5 text-graphite/75">
              {s.list.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {a.showPairingTable && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-graphite">Colour by colour</h2>
          <div className="mt-5 md:-mx-24">
            <PairingTable />
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-hairline pt-8">
        <Link href="/shop" className="inline-block rounded-full bg-graphite px-7 py-3 text-sm font-medium text-paper hover:bg-champagne">
          See the collection
        </Link>
      </div>
    </article>
  );
}
