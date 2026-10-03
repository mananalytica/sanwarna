// The shop's WhatsApp number, in international format without "+".
// Change it here, or set NEXT_PUBLIC_WHATSAPP_NUMBER in the environment.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923045519335";

/** A link that opens a WhatsApp chat with the shop, with `text` pre-filled. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_DISPLAY = `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d{3})(\d+)$/, "$1 $2 $3")}`;
