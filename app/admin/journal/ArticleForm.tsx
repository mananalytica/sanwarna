import Link from "next/link";
import { Article, bodyToText } from "@/lib/journal";
import ImageField from "@/components/admin/ImageField";
import { deleteArticleAction, saveArticleAction } from "../actions";

export default function ArticleForm({ article, error }: { article?: Article; error?: string }) {
  const a = article;
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <Link href="/admin/journal" className="text-sm text-steel hover:text-graphite">Back to journal</Link>
      <h1 className="mt-3 font-display text-3xl text-graphite">{a ? "Edit article" : "Add article"}</h1>
      {error && <p role="alert" className="mt-4 rounded-lg border border-rust/40 bg-rust/5 px-4 py-3 text-sm text-rust">{error}</p>}

      <form action={saveArticleAction} className="mt-8 space-y-6">
        <input type="hidden" name="previous_slug" value={a?.slug ?? ""} />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite">Title</span>
          <input name="title" required defaultValue={a?.title} className="input-field" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite">Summary</span>
          <input name="summary" required defaultValue={a?.summary} className="input-field" />
          <span className="mt-1 block text-xs text-steel">One sentence, shown on the journal list and in search results.</span>
        </label>

        <div role="group" aria-label="Image">
          <span className="mb-1.5 block text-sm font-medium text-graphite">Image</span>
          <ImageField name="image" defaultValue={a?.image ?? ""} />
          <span className="mt-1 block text-xs text-steel">A wide photo works best. Shown on the journal list and at the top of the article.</span>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-graphite">Article text</span>
          <textarea name="body" required rows={22} defaultValue={a ? bodyToText(a.sections) : ""} className="input-field font-mono text-[13px] leading-relaxed" />
          <span className="mt-1 block text-xs text-steel">
            Leave a blank line between paragraphs. Start a line with ## for a heading, and with - for a bullet point.
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" name="showPairingTable" defaultChecked={Boolean(a?.showPairingTable)} className="accent-champagne" />
          Show the colour matching table under the text
        </label>

        <button type="submit" className="rounded-full bg-graphite px-8 py-3 text-sm font-medium text-paper hover:bg-champagne">
          {a ? "Save changes" : "Add article"}
        </button>
      </form>

      {a && (
        <form action={deleteArticleAction} className="mt-12 border-t border-hairline pt-6">
          <input type="hidden" name="slug" value={a.slug} />
          <details>
            <summary className="cursor-pointer text-sm text-rust">Delete this article</summary>
            <p className="mt-3 text-sm text-steel">This removes the article from the site. It can&apos;t be undone.</p>
            <button type="submit" className="mt-3 rounded-full border border-rust px-6 py-2.5 text-sm text-rust hover:bg-rust hover:text-paper">Delete article</button>
          </details>
        </form>
      )}
    </div>
  );
}
