import { Product } from "@/types";

// What to wear each stone colour with. Shown on product pages ("Wear it
// with") and in the journal's matching guide. The colour is worked out
// from the product's name and colour label, so new products in these
// colours pick up the advice automatically. Add a colour here to extend it.

export type Pairing = {
  colour: string; // e.g. "Clear crystal"
  swatch: string;
  shirts: string;
  kameez: string;
  avoid: string;
  bestFor: string;
};

const PAIRINGS: { match: RegExp; pairing: Pairing }[] = [
  {
    match: /red|rouge|ruby|maroon|garnet/i,
    pairing: {
      colour: "Red crystal",
      swatch: "#8E1B1B",
      shirts: "White is the classic. Black, light grey and pale blue also work well.",
      kameez: "White, off-white, black or charcoal. Strong with a maroon or black waistcoat.",
      avoid: "Pink, orange, red or bright green, which fight with the stone.",
      bestFor: "Barat, mehndi, evening dinners.",
    },
  },
  {
    match: /black|noir|onyx|jet/i,
    pairing: {
      colour: "Black crystal",
      swatch: "#1B1B1D",
      shirts: "White, light blue, grey, pale pink. A black shirt for a tone-on-tone evening look.",
      kameez: "White, grey, sky blue, black. The safest choice with any waistcoat colour.",
      avoid: "Dark brown, where black can look mismatched.",
      bestFor: "Office, formal meetings, any event where you want quiet polish.",
    },
  },
  {
    match: /champagne|amber|ambre|gold|orange|citrine|honey|yellow/i,
    pairing: {
      colour: "Champagne-gold crystal",
      swatch: "#D9A441",
      shirts: "White, cream, light blue and navy.",
      kameez: "Off-white, cream, beige, brown, bottle green and navy. Made for ivory and gold sherwanis.",
      avoid: "Grey and silver-toned fabrics, which make the gold look out of place.",
      bestFor: "Mehndi, walima, Eid, daytime weddings.",
    },
  },
  {
    match: /clear|white|aurora|diamond/i,
    pairing: {
      colour: "Clear crystal",
      swatch: "#E9EEF4",
      shirts: "Everything. White and light blue for day, black for the evening.",
      kameez: "Any colour. White on white is the cleanest look; black and navy make the stone stand out most.",
      avoid: "Nothing. This is the one that goes with every outfit.",
      bestFor: "Barat, walima, Eid, and as a first pair.",
    },
  },
];

export const ALL_PAIRINGS: Pairing[] = [3, 0, 1, 2].map((i) => PAIRINGS[i].pairing);

/** Styling advice for a product, or null if its colour isn't recognised. */
export function pairingFor(product: Product): Pairing | null {
  const text = `${product.name} ${product.variants.map((v) => v.label).join(" ")}`;
  const colourText = text.replace(/silver/gi, "");
  for (const { match, pairing } of PAIRINGS) {
    if (match.test(colourText)) return pairing;
  }
  return null;
}
