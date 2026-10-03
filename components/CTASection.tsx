import { WhatsAppLink } from "./WhatsApp";

export default function CTASection() {
  return (
    <section className="bg-mist py-20">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl text-graphite md:text-4xl">
          Not sure which pair? Ask us on WhatsApp.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-steel">
          Send us a message for more photos, help choosing, or to place your
          order directly in the chat.
        </p>
        <div className="mt-9 flex justify-center">
          <WhatsAppLink message="Assalam o Alaikum, I'd like help choosing SANWARNA cufflinks.">
            Chat on WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
