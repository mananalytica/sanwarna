import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/getProducts";
import VideoStudioClient from "@/components/VideoStudioClient";

export const metadata: Metadata = {
  title: "Viral Video Studio",
  description:
    "Generate short-form product videos for TikTok, Instagram Reels, and YouTube Shorts — rendered in your browser, no editing skills required.",
};

export default async function VideoStudioPage() {
  const products = await getAllProducts();
  return (
    <Suspense fallback={<div className="py-24 text-center text-graphite/50">Loading studio…</div>}>
      <VideoStudioClient products={products} />
    </Suspense>
  );
}
