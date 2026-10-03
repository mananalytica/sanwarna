"use client";

import { VideoTemplate } from "@/types";
import { VIDEO_TEMPLATES } from "@/lib/videoTemplates";

export default function TemplateSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: VideoTemplate["id"]) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wider2 text-champagne/70">
        2. Choose a video template
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {VIDEO_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedId === template.id
                ? "border-champagne bg-cloud"
                : "border-champagne/15 hover:border-champagne/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-base text-graphite">{template.name}</p>
              <span className="text-xs text-champagne/70">{template.durationSeconds}s</span>
            </div>
            <p className="mt-1 text-xs text-graphite/45">{template.platformFit}</p>
            <p className="mt-2 text-sm text-graphite/60">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
