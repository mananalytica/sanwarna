import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGES } from "@/lib/pages";
import { WhatsAppLink } from "@/components/WhatsApp";

// One template for all the information pages. The words live in lib/pages.ts.
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  const p = PAGES[params.page];
  return p ? { title: p.title, description: p.description } : {};
}

export default function InfoPage({ params }: { params: { page: string } }) {
  const p = PAGES[params.page];
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-14 md:py-20">
      <h1 className="font-display text-4xl text-graphite">{p.title}</h1>
      {p.intro && <p className="mt-5 text-lg leading-relaxed text-graphite/80">{p.intro}</p>}

      {p.sections.map((s, i) => (
        <section key={i} className="mt-10">
          {s.heading && <h2 className="font-display text-2xl text-graphite">{s.heading}</h2>}
          {s.body?.map((para) => (
            <p key={para} className="mt-4 leading-relaxed text-graphite/70">{para}</p>
          ))}
          {s.list && (
            <ul className="mt-4 space-y-2.5 text-graphite/70">
              {s.list.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {s.qa && (
            <dl className="divide-y divide-hairline border-y border-hairline">
              {s.qa.map(({ q, a }) => (
                <div key={q} className="py-5">
                  <dt className="font-medium text-graphite">{q}</dt>
                  <dd className="mt-2 leading-relaxed text-graphite/70">{a}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}

      {p.whatsapp && (
        <div className="mt-12 flex">
          <WhatsAppLink message={p.whatsapp}>Message us on WhatsApp</WhatsAppLink>
        </div>
      )}
    </article>
  );
}
