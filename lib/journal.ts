// Journal articles. Add a new one by adding an entry to ARTICLES; it
// appears on /journal automatically, newest (first in the list) first.
// Keep them practical: each answers one question a buyer actually has.

export type ArticleSection = { heading?: string; body?: string[]; list?: string[] };
export type Article = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  /** Photo shown on the journal list and at the top of the article. */
  image?: string;
  /** Shows the colour-by-colour matching table from lib/pairing.ts under the text. */
  showPairingTable?: boolean;
  sections: ArticleSection[];
};

export const ARTICLES: Article[] = [
  {
    slug: "matching-cufflinks-to-shirts-and-shalwar-kameez",
    image: "/images/products/rouge-wide-1.jpg",
    title: "Which colour with which outfit: shirts and shalwar kameez",
    summary: "A colour-by-colour guide to pairing crystal cufflinks with shirts, suits and shalwar kameez.",
    date: "2026-10-04",
    showPairingTable: true,
    sections: [
      {
        body: [
          "The rule is simple: let one thing stand out. If your outfit is plain, a coloured stone gives it life. If your outfit is already busy, with embroidery or a patterned waistcoat, choose a clear or black stone and let the clothes lead.",
          "The second rule is contrast. A stone shows best against a cuff that is lighter or darker than it is. Red on white, clear on black and gold on navy all work for that reason.",
        ],
      },
      {
        heading: "With a waistcoat or sherwani",
        body: [
          "Match the stone to the waistcoat, not the kameez. A maroon waistcoat with a red stone, or an ivory and gold sherwani with a champagne stone, looks deliberate. If you cannot match, go clear: it never clashes.",
        ],
      },
      {
        heading: "Metal matters too",
        body: [
          "These settings are silver-toned, so they sit best with a silver or steel watch and a silver-buckled belt. If your watch is gold, the champagne stone ties the two together.",
        ],
      },
    ],
  },
  {
    slug: "how-to-wear-cufflinks",
    image: "/images/products/aurora-wide-1.jpg",
    title: "How to wear cufflinks: a simple guide for first-timers",
    summary: "Putting on a cufflink takes ten seconds once you know the order.",
    date: "2026-10-04",
    sections: [
      {
        body: ["If you have never worn cufflinks, the only thing to learn is the fold. After that it takes ten seconds a sleeve."],
      },
      {
        heading: "Step by step",
        list: [
          "Put the shirt or kameez on and fold the cuff back on itself if it is a double cuff.",
          "Pinch the two edges of the cuff together so they point away from your wrist, like a kiss, with the buttonholes lined up.",
          "Turn the toggle at the back of the cufflink so it is in line with the post.",
          "Push the post through all the holes from the outside, so the stone sits on the outer side of your wrist.",
          "Turn the toggle flat again to lock it.",
        ],
      },
      {
        heading: "Which way round",
        body: ["The stone faces outward, away from your body, so it shows when your arm is at your side or on a table. The toggle sits on the inner side."],
      },
      {
        heading: "How it should look",
        body: ["About a centimetre of cuff should show beyond your jacket or waistcoat sleeve. That is what frames the cufflink. If the sleeve hides the cuff, the cufflink is hidden too."],
      },
    ],
  },
  {
    slug: "which-shirts-work-with-cufflinks",
    image: "/images/products/aurora-1.jpg",
    title: "Which shirts work with cufflinks? Double cuffs explained",
    summary: "Cufflinks need a cuff with holes on both sides. Here is how to tell what you have.",
    date: "2026-10-04",
    sections: [
      {
        body: ["Cufflinks do not work on every shirt. They need a cuff with a buttonhole on both edges and no button sewn on. There are three kinds of cuff you will meet."],
      },
      {
        heading: "The three cuffs",
        list: [
          "Double cuff (also called French cuff): extra long, folded back on itself, holes on both sides. Made for cufflinks. The most formal.",
          "Single cufflink cuff: not folded, but with a hole on both sides and no button. Common on kameez and on evening shirts.",
          "Button cuff (barrel cuff): a button on one side and a hole on the other. This is the ordinary office shirt, and it will not take cufflinks.",
        ],
      },
      {
        heading: "Convertible cuffs",
        body: ["Some shirts have a button and an extra hole beside it, so they work both ways. Look for a second buttonhole next to the button."],
      },
      {
        heading: "Getting one made",
        body: ["Any tailor can stitch a shirt or kameez with cufflink cuffs. Ask for a double cuff, or say you want holes on both sides and no button."],
      },
    ],
  },
  {
    slug: "cufflinks-for-the-groom",
    image: "/images/products/rouge-wide-3.jpg",
    title: "Cufflinks for the groom: barat and walima",
    summary: "What to wear on each day, and how to match the groomsmen.",
    date: "2026-10-04",
    sections: [
      {
        body: ["The groom is photographed more in two days than in the rest of his life. Hands are in most of those pictures: signing, greeting, holding a cup. The cuff is worth getting right."],
      },
      {
        heading: "Barat",
        body: ["With a sherwani, the sleeve usually covers the cuff, so cufflinks show most when you are seated. Choose a stone that matches the sherwani's work: champagne for ivory and gold, clear for white and silver, red for maroon."],
      },
      {
        heading: "Walima",
        body: ["A suit shows the cuff all evening. Clear crystal is the classic with a black or navy suit. A red or champagne stone adds colour if the suit and tie are plain."],
      },
      {
        heading: "Groomsmen",
        body: ["Giving the same pair to your brothers and close friends is a simple gift that also ties the photographs together. Black or clear suits everyone's outfit."],
      },
      {
        heading: "Order early",
        body: ["Order at least two weeks before the first event, so there is time for delivery and to try them on with the outfit."],
      },
    ],
  },
  {
    slug: "cufflinks-with-sherwani-or-kurta",
    image: "/images/products/rouge-1.jpg",
    title: "Can you wear cufflinks with a sherwani or kurta?",
    summary: "Yes. Here is what to ask your tailor for.",
    date: "2026-10-04",
    sections: [
      {
        body: ["Yes, and it is one of the best places to wear them. A kameez or kurta cuff is plain, so a stone has room to stand out."],
      },
      {
        heading: "The cuff",
        body: ["Ask your tailor for cufflink cuffs: a cuff with a buttonhole on both sides and no button. Many ready-made formal kameez already have them. Check before you buy."],
      },
      {
        heading: "With a waistcoat",
        body: ["A waistcoat leaves the whole sleeve on show, which makes this the outfit where cufflinks are seen most. Match the stone to the waistcoat colour, or choose clear."],
      },
      {
        heading: "With a sherwani",
        body: ["The sherwani sleeve is long, so the cufflink shows as a flash at the wrist. A larger stone works well here because it only appears in glimpses."],
      },
    ],
  },
  {
    slug: "gift-ideas-for-him",
    image: "/images/products/aurora-wide-4.jpg",
    title: "Gift ideas for him: Eid, anniversaries and weddings",
    summary: "Why cufflinks make an easy, lasting gift, and how to choose a colour for someone else.",
    date: "2026-10-04",
    sections: [
      {
        body: ["Men are hard to buy for because most gifts are either used up or put in a drawer. Cufflinks are worn at the events he remembers."],
      },
      {
        heading: "Choosing a colour for someone else",
        list: [
          "If you do not know his wardrobe: clear. It goes with everything.",
          "If he wears mostly dark suits: black or clear.",
          "If he likes to be noticed: red.",
          "If he wears a lot of cream, brown and navy: champagne-gold.",
        ],
      },
      {
        heading: "Who they suit",
        list: ["A husband or fiancé, for an anniversary or Eid.", "A groom, from his bride's family.", "A brother or friend getting married, from the groomsmen.", "A father, for a milestone birthday."],
      },
      {
        heading: "Ready to give",
        body: ["Every pair comes in a black velvet box, so there is nothing to wrap unless you want to."],
      },
    ],
  },
  {
    slug: "how-to-care-for-cufflinks",
    image: "/images/products/aurora-wide-2.jpg",
    title: "How to care for cufflinks so they stay bright",
    summary: "Five habits that keep the stones clear and the metal polished.",
    date: "2026-10-04",
    sections: [
      {
        body: ["Crystal stays bright when it is kept clean and dry. Most dullness is a film of perfume, sweat or soap, not damage."],
      },
      {
        heading: "Five habits",
        list: [
          "Put them on last, after perfume and attar have dried.",
          "Wipe with a soft dry cloth after wearing. A glasses cloth is ideal.",
          "Keep them in their box, each pair on its own.",
          "Take them off before washing up, showering or swimming.",
          "Never use jewellery cleaning liquid or metal polish on them.",
        ],
      },
      {
        heading: "If a stone looks cloudy",
        body: ["Breathe on it and wipe gently with a dry cloth. If that does not clear it, use a cloth barely dampened with plain water, then dry it straight away."],
      },
    ],
  },
  {
    slug: "cufflinks-tie-pins-and-tie-bars",
    image: "/images/products/rouge-wide-2.jpg",
    title: "Cufflinks, tie pins and tie bars: what each one is for",
    summary: "Three small accessories that are often confused.",
    date: "2026-10-04",
    sections: [
      {
        body: ["These three are often mixed up. Each has a different job."],
      },
      {
        list: [
          "Cufflinks fasten the cuff of a shirt or kameez in place of a button. They are worn in pairs, one on each wrist.",
          "A tie bar (or tie clip) is a flat bar that slides across the tie and clips it to the shirt front, so the tie stays straight.",
          "A tie pin is a pin with a decorative head, pushed through the tie to hold it. It is the older, more formal option.",
        ],
      },
      {
        heading: "Wearing them together",
        body: ["Cufflinks and a tie bar can be worn together. Keep the metals the same: silver with silver. Wear a tie bar or a tie pin, not both."],
      },
      {
        heading: "Without a tie",
        body: ["Cufflinks do not need a tie. With an open collar or a kameez they are often the only jewellery a man wears, which is why the stone matters."],
      },
    ],
  },
];

// ── Plain-text form of an article body, used by the admin editor ─────────
// A line starting "## " is a heading, lines starting "- " are bullet
// points, and anything else is a paragraph (blank line between paragraphs).

export function bodyToText(sections: ArticleSection[]): string {
  return sections
    .map((s) => [s.heading ? `## ${s.heading}` : "", ...(s.body ?? []), (s.list ?? []).map((i) => `- ${i}`).join("\n")].filter(Boolean).join("\n\n"))
    .join("\n\n");
}

export function textToBody(text: string): ArticleSection[] {
  const sections: ArticleSection[] = [{}];
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    for (const chunk of block.split(/\n(?=## )/)) {
      const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;
      if (lines[0].startsWith("## ")) {
        sections.push({ heading: lines.shift()!.slice(3).trim() });
        if (lines.length === 0) continue;
      }
      const cur = sections[sections.length - 1];
      const bullets = lines.filter((l) => /^[-•*] /.test(l)).map((l) => l.slice(2).trim());
      const prose = lines.filter((l) => !/^[-•*] /.test(l)).join(" ");
      if (prose) (cur.body ??= []).push(prose);
      if (bullets.length) (cur.list ??= []).push(...bullets);
    }
  }
  return sections.filter((s) => s.heading || s.body?.length || s.list?.length);
}
