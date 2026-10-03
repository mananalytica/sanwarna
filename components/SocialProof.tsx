// PARKED: not currently rendered anywhere (see app/page.tsx). SANWARNA
// doesn't have real customer reviews or press mentions yet, and this
// component's content below is placeholder — don't show it on the site
// until it's replaced with real testimonials/press. Re-add
// `<SocialProof />` to app/page.tsx once that content exists.

const TESTIMONIALS = [
  {
    quote:
      "Used the Try-On studio before buying and it genuinely helped me pick the finish. The Regent looks even better in person.",
    name: "D. Whitfield",
    context: "Verified buyer — The Regent Cufflinks",
  },
  {
    quote:
      "Made a 9-second reel with the Video Studio for my brother's wedding gift and it got more engagement than anything I've posted this year.",
    name: "M. Okafor",
    context: "Verified buyer — Heritage Presentation Set",
  },
  {
    quote:
      "The onyx pair is heavier and more substantial than I expected. Feels like a piece you keep, not a piece you replace.",
    name: "R. Castellano",
    context: "Verified buyer — Obsidian Onyx Cufflinks",
  },
];

const PRESS = ["GENTLEMAN'S QUARTERLY", "THE STYLE LEDGER", "MENSWEAR DAILY", "SUITED"];

export default function SocialProof() {
  return (
    <section className="border-y border-champagne/10 bg-mist py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-50">
          {PRESS.map((name) => (
            <span key={name} className="font-display text-sm tracking-[0.2em] text-graphite">
              {name}
            </span>
          ))}
        </div>

        <div className="hairline my-12" />

        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col">
              <blockquote className="text-balance font-display text-lg italic leading-relaxed text-graphite/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-champagne/80">
                {t.name}
                <span className="block text-xs text-graphite/40">{t.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
