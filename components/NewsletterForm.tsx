"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p className="mt-3 text-sm text-champagne">You&apos;re on the list.</p>;
  }

  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="you@email.com"
        className="w-full rounded-xl border border-champagne/30 bg-transparent px-3 py-2 text-sm text-graphite placeholder:text-graphite/40 focus:border-champagne"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-champagne px-4 py-2 text-sm font-medium text-graphite transition-colors hover:bg-champagne-light"
      >
        Join
      </button>
    </form>
  );
}
