import { VideoTemplate } from "@/types";

// Reusable templates: pick a product, pick a template, get a ready short-form
// video concept + an actual rendered preview (via canvas/MediaRecorder — see
// components/video-studio/VideoRenderer.tsx). New products automatically get
// all four variations for free since templates only reference product data.

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: "hook-reveal",
    name: "Hook & Reveal",
    platformFit: "TikTok · Reels · Shorts — 9:16",
    description:
      "Fast cold-open hook, a beat of anticipation, then a macro reveal of the piece. Built for the 3-second scroll-stop.",
    durationSeconds: 9,
    hookText: "POV: your cufflinks cost more than their watch.",
    captionText: "The detail everyone asks about. Link in bio.",
    ctaText: "Shop the drop →",
    mood: "bold",
  },
  {
    id: "cinematic-macro",
    name: "Cinematic Macro",
    platformFit: "Reels · Shorts — 9:16",
    description:
      "Slow, moody close-up pans across the product with soft gold light sweeps. Editorial, quiet-luxury pacing.",
    durationSeconds: 11,
    hookText: "Some details aren't meant to be loud.",
    captionText: "Hand-finished. Quietly unmistakable.",
    ctaText: "Discover the collection →",
    mood: "minimal",
  },
  {
    id: "before-glow-up",
    name: "Before / After Glow-Up",
    platformFit: "TikTok · Reels — 9:16",
    description:
      "Split-style transformation: plain cuff to finished look, timed to a beat drop. Great for outfit-check content.",
    durationSeconds: 10,
    hookText: "Same suit. Different man.",
    captionText: "The upgrade nobody sees coming.",
    ctaText: "Get the look →",
    mood: "energetic",
  },
  {
    id: "unboxing-luxe",
    name: "Luxe Unboxing",
    platformFit: "TikTok · Reels · Shorts — 9:16",
    description:
      "Box open, tissue reveal, product hero shot, then styled on-body. The gifting-season favorite.",
    durationSeconds: 12,
    hookText: "Opening the box my dad said was 'excessive.'",
    captionText: "Presentation is part of the product.",
    ctaText: "Shop gifting →",
    mood: "romantic",
  },
];

export function getTemplateById(id: string): VideoTemplate | undefined {
  return VIDEO_TEMPLATES.find((t) => t.id === id);
}
