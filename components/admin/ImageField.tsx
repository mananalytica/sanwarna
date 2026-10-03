"use client";

import { useRef, useState } from "react";

/**
 * A photo-link field for the admin product form with an "Upload" button.
 *
 * Picked photos are shrunk and compressed here in the browser (so even a
 * 10 MB phone photo uploads as a few hundred KB), then sent to
 * /api/admin/upload, and the returned link is put into the field. Links
 * can still be typed or pasted by hand.
 */

const MAX_SIDE = 1600; // longest side of the stored JPG
const WEBP_WIDTHS = [320, 640, 1280]; // must match lib/imageLoader.js

function draw(img: ImageBitmap, width: number, type: string, quality: number): Promise<Blob> {
  const w = Math.min(width, img.width);
  const h = Math.round((img.height * w) / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b && b.type === type ? resolve(b) : reject(new Error("unsupported"))), type, quality)
  );
}

async function compressAndUpload(file: File): Promise<string> {
  let img: ImageBitmap;
  try {
    img = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`${file.name} isn't a photo this browser can open. Use a JPG or PNG.`);
  }
  const jpgWidth = img.width >= img.height ? MAX_SIDE : Math.round((MAX_SIDE * img.width) / img.height);
  const body = new FormData();
  try {
    body.set("jpg", await draw(img, jpgWidth, "image/jpeg", 0.85), "photo.jpg");
    for (const w of WEBP_WIDTHS) body.set(`w${w}`, await draw(img, w, "image/webp", 0.78), `photo-${w}.webp`);
  } catch {
    throw new Error("This browser can't compress photos. Please use a current Chrome, Edge, Firefox or Safari.");
  }
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "The upload failed. Please try again.");
  return data.url as string;
}

export default function ImageField({
  name,
  defaultValue = "",
  multiple = false,
  required = false,
  rows = 3,
}: {
  name: string;
  defaultValue?: string;
  multiple?: boolean;
  required?: boolean;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const links = value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    setError(null);
    for (let i = 0; i < files.length; i++) {
      setStatus(`Compressing and uploading ${i + 1} of ${files.length}…`);
      try {
        const url = await compressAndUpload(files[i]);
        setValue((v) => (multiple ? [v.trim(), url].filter(Boolean).join("\n") : url));
      } catch (err) {
        setError(err instanceof Error ? err.message : "The upload failed.");
        break;
      }
    }
    setStatus(null);
  }

  return (
    <div>
      {multiple ? (
        <textarea name={name} rows={rows} value={value} onChange={(e) => setValue(e.target.value)} className="input-field" />
      ) : (
        <input name={name} required={required} value={value} onChange={(e) => setValue(e.target.value)} className="input-field" />
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={status !== null}
          onClick={() => picker.current?.click()}
          className="rounded-full border border-graphite/25 px-4 py-1.5 text-xs font-medium text-graphite hover:border-graphite disabled:opacity-50"
        >
          {multiple ? "Upload photos" : "Upload photo"}
        </button>
        <input ref={picker} type="file" accept="image/*" multiple={multiple} onChange={onPick} className="sr-only" tabIndex={-1} aria-hidden />
        {status && <span role="status" className="text-xs text-steel">{status}</span>}
        {error && <span role="alert" className="text-xs text-rust">{error}</span>}
      </div>

      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-16 w-16 rounded-lg border border-hairline bg-cloud object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
