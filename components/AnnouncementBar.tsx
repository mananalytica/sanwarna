// The running headline across the top of every page. Edit MESSAGES to
// change what it says. It scrolls slowly, pauses when pointed at, and
// stands still for visitors who have asked their device to reduce motion.
const MESSAGES = ["Free delivery all over Pakistan", "Cash on Delivery", "Beauty in every detail"];

export default function AnnouncementBar() {
  const run = (hidden: boolean) => (
    <ul className="ticker-run flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {[...MESSAGES, ...MESSAGES, ...MESSAGES].map((m, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 text-xs tracking-wide md:text-[13px]">
          <span aria-hidden className="mr-12 h-1 w-1 rotate-45 bg-champagne-light" />
          {m}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="ticker overflow-hidden bg-graphite py-2 text-paper" role="region" aria-label="Announcement">
      <p className="sr-only">{MESSAGES.join(". ")}.</p>
      <div className="ticker-track flex w-max" aria-hidden>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
