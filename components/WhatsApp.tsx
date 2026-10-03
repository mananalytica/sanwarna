import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.8a9.2 9.2 0 0 0-7.9 13.900L3 21l4.4-1.100A9.2 9.2 0 1 0 12 2.800Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 7.400c-.4 0-.8.2-1 .600-.6.9-.6 2.1 0 3.3 1.1 2.3 2.9 4.1 5.2 5.1 1.1.500 2.2.400 3-.200.4-.300.6-.800.5-1.300l-.1-.400-2.2-1-.9 1a6 6 0 0 1-3.2-3.200l.9-.900-.9-2.300L9 7.400Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Green "… on WhatsApp" button. Opens a chat with `message` pre-filled. */
export function WhatsAppLink({
  message,
  children,
  className = "",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-full bg-[#1FAF54] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#178C43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#178C43] ${className}`}
    >
      <WhatsAppIcon size={18} />
      {children}
    </a>
  );
}

/** Round button fixed to the corner of every page. */
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Assalam o Alaikum, I have a question about SANWARNA cufflinks.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FAF54] text-white shadow-lift transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#178C43]"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
