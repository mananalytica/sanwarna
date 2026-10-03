"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, VideoTemplate } from "@/types";
import ProductPicker from "./ProductPicker";
import TemplateSelector from "./TemplateSelector";
import { VIDEO_TEMPLATES } from "@/lib/videoTemplates";
import { renderVideo, RenderProgress } from "@/lib/videoRenderer";

const MUSIC_MOODS = [
  { id: "none", label: "No music (add your own on TikTok/Reels)" },
  { id: "bold", label: "Bold & percussive" },
  { id: "romantic", label: "Warm & orchestral" },
  { id: "minimal", label: "Minimal & ambient" },
];

export default function VideoStudioClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("product");
  const initial = products.find((p) => p.slug === initialSlug) ?? products[0];

  const [productId, setProductId] = useState(initial.id);
  const [templateId, setTemplateId] = useState<VideoTemplate["id"]>(VIDEO_TEMPLATES[0].id);
  const [musicMood, setMusicMood] = useState("bold");
  const [personalPhoto, setPersonalPhoto] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.id === productId) ?? products[0];
  const template = VIDEO_TEMPLATES.find((t) => t.id === templateId) ?? VIDEO_TEMPLATES[0];

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPersonalPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    setError(null);
    setRendering(true);
    setVideoUrl(null);
    try {
      const blob = await renderVideo(product, template, personalPhoto, setProgress);
      setVideoUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong rendering the video. Try a different browser."
      );
    } finally {
      setRendering(false);
    }
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `sanwarna-${product.slug}-${template.id}.webm`;
    a.click();
  }

  async function shareVideo() {
    if (!videoUrl) return;
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const file = new File([blob], `sanwarna-${product.slug}.webm`, { type: blob.type });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SANWARNA — ${product.name}`,
          text: template.captionText,
        });
        return;
      }
    } catch {
      // fall through to download
    }
    downloadVideo();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-16">
      <div>
        <p className="text-xs uppercase tracking-wider2 text-champagne/70">Viral Video Studio</p>
        <h1 className="mt-3 font-display text-4xl text-graphite">
          Turn any piece into a short film
        </h1>
        <p className="mt-4 max-w-md text-balance text-graphite/65">
          Pick a product and a template, optionally drop in a personal photo,
          and render a ready-to-post 9:16 clip — cinematic transitions, text
          hooks, and a CTA card, rendered entirely in your browser.
        </p>

        <div className="mt-8 space-y-8">
          <ProductPicker products={products} selectedId={productId} onSelect={setProductId} />
          <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />

          <div>
            <p className="mb-3 text-xs uppercase tracking-wider2 text-champagne/70">
              3. Optional: add your own photo
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-champagne/40 px-4 py-2 text-sm text-champagne hover:bg-champagne hover:text-graphite"
              >
                {personalPhoto ? "Change Photo" : "Upload Photo"}
              </button>
              {personalPhoto && (
                <button
                  onClick={() => setPersonalPhoto(null)}
                  className="text-xs text-graphite/40 hover:text-rust"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div>
            <label htmlFor="music" className="mb-2 block text-xs uppercase tracking-wider2 text-champagne/70">
              4. Music mood (placeholder — add your own free-license track when posting)
            </label>
            <select
              id="music"
              value={musicMood}
              onChange={(e) => setMusicMood(e.target.value)}
              className="w-full rounded-xl border border-champagne/25 bg-cloud px-3 py-2 text-sm text-graphite focus:border-champagne"
            >
              {MUSIC_MOODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={rendering}
            className="w-full rounded-full bg-champagne py-3 text-sm font-medium tracking-wide text-graphite transition-colors hover:bg-champagne-light disabled:opacity-50"
          >
            {rendering ? "Rendering…" : "Generate Video"}
          </button>

          {error && <p className="text-sm text-rust">{error}</p>}
        </div>
      </div>

      <div className="md:sticky md:top-24 md:h-fit">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-lg border border-champagne/20 bg-cloud">
          {videoUrl ? (
            <video src={videoUrl} controls loop className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              {rendering ? (
                <>
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-champagne border-t-transparent" />
                  <p className="text-sm text-graphite/60">{progress?.phase ?? "Rendering…"}</p>
                  <div className="h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full bg-champagne transition-all"
                      style={{ width: `${Math.round((progress?.progress ?? 0) * 100)}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="font-display text-lg text-graphite">{template.name}</p>
                  <p className="text-xs text-graphite/45">{template.platformFit}</p>
                  <p className="text-sm text-graphite/55">
                    Your rendered preview will appear here.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {videoUrl && (
          <div className="mx-auto mt-6 flex max-w-xs gap-3">
            <button
              onClick={downloadVideo}
              className="flex-1 rounded-xl bg-champagne py-2.5 text-sm font-medium text-graphite hover:bg-champagne-light"
            >
              Download
            </button>
            <button
              onClick={shareVideo}
              className="flex-1 rounded-xl border border-champagne/40 py-2.5 text-sm text-champagne hover:bg-champagne hover:text-graphite"
            >
              Share
            </button>
          </div>
        )}

        <p className="mx-auto mt-4 max-w-xs text-center text-xs text-graphite/35">
          Exports as .webm. Most phones convert automatically on upload; for a
          direct .mp4, use any free converter before posting.
        </p>
      </div>
    </div>
  );
}
