"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import imageLoader from "@/lib/imageLoader";

/**
 * A photo field for the admin product form.
 *
 *  - Upload: pick photos, or drop them here from your computer. The
 *    original file is stored as it is: no resizing, no re-compression.
 *  - Library: shows every photo already in storage; click one to use it, or
 *    drag it onto any photo field on the page.
 *  - Each chosen photo shows as a tile: drag tiles to reorder, × to remove.
 *
 * The form submits the hidden field `name`: one link (single) or one link
 * per line (multiple).
 */

const DRAG_TYPE = "application/x-sanwarna-photo";
const thumb = (src: string) => imageLoader({ src, width: 320 });
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

/** Sends the original file to storage exactly as it is: no resizing, no re-compression. */
async function uploadOriginal(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error(`${file.name} must be a JPG, PNG or WebP photo.`);
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
  try {
    const blob = await upload(`originals/${safe}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
    return blob.url;
  } catch (err) {
    console.error("[upload]", err);
    throw new Error(
      `${file.name} could not be uploaded. Check that you are still signed in and that photo storage is connected in Vercel, then try again.`
    );
  }
}

const split = (v: string) => v.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

export default function ImageField({
  name,
  defaultValue = "",
  multiple = false,
  required = false,
}: {
  name: string;
  defaultValue?: string;
  multiple?: boolean;
  required?: boolean;
}) {
  const [links, setLinks] = useState<string[]>(split(defaultValue));
  const [pending, setPending] = useState<string[]>([]); // local previews of photos still uploading
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [library, setLibrary] = useState<string[] | null>(null);
  const [libraryState, setLibraryState] = useState<"closed" | "loading" | "open">("closed");
  const [pasting, setPasting] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  const add = (url: string, before?: string) =>
    setLinks((cur) => {
      if (!multiple) return [url];
      const rest = cur.filter((l) => l !== url);
      const at = before ? rest.indexOf(before) : -1;
      return at === -1 ? [...rest, url] : [...rest.slice(0, at), url, ...rest.slice(at)];
    });

  async function upload(files: File[]) {
    setError(null);
    const list = (multiple ? files : files.slice(0, 1)).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    const previews = list.map((f) => URL.createObjectURL(f));
    setPending(previews);
    for (let i = 0; i < list.length; i++) {
      try {
        add(await uploadOriginal(list[i]));
      } catch (err) {
        setError(err instanceof Error ? err.message : "The upload failed.");
        break;
      } finally {
        setPending((p) => p.filter((x) => x !== previews[i]));
        URL.revokeObjectURL(previews[i]);
      }
    }
    setPending([]);
    if (library) void loadLibrary(); // show the new photos in the library too
  }

  async function loadLibrary() {
    setLibraryState((s) => (s === "open" ? "open" : "loading"));
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLibrary(data.photos as string[]);
      setLibraryState("open");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "The photo library could not be loaded.");
      setLibraryState("closed");
    }
  }

  function onDrop(e: React.DragEvent, before?: string) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const url = e.dataTransfer.getData(DRAG_TYPE);
    if (url) add(url, before);
    else if (e.dataTransfer.files.length) void upload(Array.from(e.dataTransfer.files));
  }
  const dragStart = (url: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData(DRAG_TYPE, url);
    e.dataTransfer.effectAllowed = "copyMove";
  };
  const allow = (e: React.DragEvent) => e.preventDefault();

  const small = "rounded-full border border-graphite/25 px-4 py-1.5 text-xs font-medium text-graphite hover:border-graphite disabled:opacity-50";
  const busy = pending.length > 0;

  return (
    <div>
      {/* what the form actually submits */}
      <input type="hidden" name={name} value={links.join("\n")} />

      <div
        onDragOver={(e) => {
          allow(e);
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => onDrop(e)}
        className={`rounded-xl border-2 border-dashed p-3 transition-colors ${over ? "border-champagne bg-champagne/5" : "border-hairline bg-cloud"}`}
      >
        {links.length === 0 && !busy ? (
          <p className="px-2 py-6 text-center text-sm text-steel">
            {multiple ? "No photos yet. Drop photos here, upload, or choose from the library." : "No photo yet. Drop one here, upload, or choose from the library."}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {links.map((src, i) => (
              <li
                key={src}
                draggable
                onDragStart={dragStart(src)}
                onDragOver={allow}
                onDrop={(e) => onDrop(e, src)}
                className="group relative h-28 w-28 cursor-grab overflow-hidden rounded-lg border border-hairline bg-paper active:cursor-grabbing"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(src)} alt={`Photo ${i + 1}`} draggable={false} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setLinks((cur) => cur.filter((l) => l !== src))}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-graphite/80 text-sm leading-none text-paper hover:bg-rust"
                >
                  ×
                </button>
              </li>
            ))}
            {pending.map((src) => (
              <li key={src} className="relative h-28 w-28 overflow-hidden rounded-lg border border-hairline bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover opacity-40" />
                <span role="status" className="absolute inset-0 flex items-center justify-center text-xs font-medium text-graphite">
                  Uploading…
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {required && links.length === 0 && <input tabIndex={-1} aria-hidden required value="" onChange={() => {}} className="sr-only" />}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => picker.current?.click()} className={small}>
          {multiple ? "Upload photos" : "Upload photo"}
        </button>
        <button
          type="button"
          onClick={() => (libraryState === "closed" ? void loadLibrary() : setLibraryState("closed"))}
          aria-expanded={libraryState === "open"}
          className={small}
        >
          {libraryState === "open" ? "Close library" : libraryState === "loading" ? "Loading library…" : "Choose from library"}
        </button>
        <button type="button" onClick={() => setPasting((p) => !p)} aria-expanded={pasting} className={small}>
          Paste a link
        </button>
        {multiple && links.length > 1 && <span className="text-xs text-steel">Drag photos to change their order.</span>}
        <input ref={picker} type="file" accept="image/*" multiple={multiple} tabIndex={-1} aria-hidden className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            void upload(files);
          }}
        />
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-rust">{error}</p>}

      {pasting && (
        <textarea
          rows={multiple ? 3 : 1}
          aria-label="Photo links, one per line"
          placeholder={multiple ? "One link per line" : "https://… or /images/products/…"}
          value={links.join("\n")}
          onChange={(e) => setLinks(multiple ? split(e.target.value) : split(e.target.value).slice(0, 1))}
          className="input-field mt-2"
        />
      )}

      {libraryState === "open" && library && (
        <div className="mt-3 rounded-xl border border-hairline bg-paper p-3">
          <p className="mb-2 text-xs text-steel">
            {library.length === 0
              ? "The library is empty. Photos you upload appear here."
              : "Click a photo to use it here, or drag it onto any photo box on this page."}
          </p>
          <ul className="flex max-h-72 flex-wrap gap-2 overflow-y-auto">
            {library.map((src) => {
              const used = links.includes(src);
              return (
                <li key={src}>
                  <button
                    type="button"
                    draggable
                    onDragStart={dragStart(src)}
                    onClick={() => add(src)}
                    aria-label={used ? "Photo already used in this box" : "Use this photo"}
                    className={`block h-20 w-20 cursor-grab overflow-hidden rounded-lg border-2 ${used ? "border-champagne" : "border-transparent hover:border-graphite/40"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(src)} alt="" draggable={false} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
