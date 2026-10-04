import { WHATSAPP_DISPLAY } from "./whatsapp";

// The text of the site's information pages (About, Delivery, Returns…).
// One entry per page; app/[page]/page.tsx renders them. Edit the words
// here. Keep every statement true: these are promises to customers.

export type InfoSection = { heading?: string; body?: string[]; list?: string[]; qa?: { q: string; a: string }[] };
export type InfoPage = { title: string; description: string; intro?: string; sections: InfoSection[]; whatsapp?: string };

export const PAGES: Record<string, InfoPage> = {
  about: {
    title: "About SANWARNA",
    description: "Sanwarna means to adorn. The story behind the name and our first collection.",
    intro: "Sanwarna means to adorn, to make beautiful. That is the whole idea behind the brand: beauty in every detail.",
    sections: [
      {
        heading: "Why we started",
        body: [
          "A man's cuff is the one place he can wear a jewel, and most cufflinks on offer are forgettable. We wanted pieces that get noticed across a wedding hall and still look right in the office on Monday.",
          "We are a small team in Pakistan. When you message us on WhatsApp, you are talking to the people who pack your order.",
        ],
      },
      {
        heading: "The Crystal Collection",
        body: [
          "Our first collection is built around one design: a large, square-cut crystal in an open, polished silver-tone frame, held by four stone-set claws. It comes in several colours, and every pair arrives in a black velvet box, ready to gift.",
        ],
      },
      {
        heading: "What comes next",
        body: ["Cufflinks are where we begin. More pieces, for men and for women, will follow under the same promise."],
      },
    ],
    whatsapp: "Assalam o Alaikum, I'd like to know more about SANWARNA.",
  },

  delivery: {
    title: "Delivery and payment",
    description: "Free delivery across Pakistan. Pay by Cash on Delivery or JazzCash.",
    intro: "Delivery is free on every order, anywhere in Pakistan.",
    sections: [
      {
        heading: "How delivery works",
        list: [
          "You place your order on the site or on WhatsApp.",
          "We confirm it with you by call or WhatsApp before it ships.",
          "When we confirm, we tell you the expected delivery date for your city.",
          "Your parcel is delivered to your door by courier.",
        ],
      },
      {
        heading: "How to pay",
        list: [
          "Cash on Delivery: pay the courier in cash when your order arrives.",
          "JazzCash: pay online at checkout with your JazzCash wallet or a card.",
        ],
      },
      { heading: "Delivery charges", body: ["None. The price you see is the price you pay."] },
    ],
    whatsapp: "Assalam o Alaikum, I have a question about delivery.",
  },

  returns: {
    title: "Returns and replacements",
    description: "What to do if your SANWARNA order arrives damaged or is not what you ordered.",
    intro: "If your order arrives damaged, or is not what you ordered, we will put it right.",
    sections: [
      {
        heading: "What to do",
        list: [
          "Message us on WhatsApp as soon as you can after delivery.",
          "Send a photo of the item and the parcel.",
          "We will arrange a replacement at no cost to you.",
        ],
      },
      {
        heading: "Before you order",
        body: [
          "Not sure about a colour or how it will look? Ask us on WhatsApp first. We are happy to send more photos or a short video of the exact piece.",
        ],
      },
    ],
    whatsapp: "Assalam o Alaikum, I need help with an order I received.",
  },

  care: {
    title: "Care guide",
    description: "How to keep your SANWARNA cufflinks bright.",
    intro: "A little care keeps the stones bright and the metal polished.",
    sections: [
      {
        list: [
          "Put your cufflinks on last, after perfume, attar and hair products.",
          "Wipe them with a soft, dry cloth after each wear.",
          "Keep them in their box, away from water and humidity.",
          "Take them off before showering, swimming or washing up.",
          "Do not use jewellery cleaning liquids or polish on them.",
          "Store each pair in its own box so the stones do not scratch each other.",
        ],
      },
    ],
  },

  faq: {
    title: "Questions and answers",
    description: "Delivery, payment, shirts, gifting and ordering: common questions about SANWARNA.",
    sections: [
      {
        qa: [
          { q: "Is Cash on Delivery available in my city?", a: "Cash on Delivery is available across Pakistan. If you are unsure about your area, message us on WhatsApp before ordering." },
          { q: "How much is delivery?", a: "Delivery is free on every order." },
          { q: "How long does delivery take?", a: "We confirm every order by call or WhatsApp and tell you the expected delivery date for your city at that point." },
          { q: "What are they made of?", a: "A square-cut crystal stone set in a polished silver-tone metal frame, with small accent stones on each claw. Each product page lists the details." },
          { q: "Do they fit a normal shirt?", a: "Cufflinks need a cuff with a buttonhole on both sides. That means a double (French) cuff shirt, or a shirt or kameez made with cufflink cuffs. A standard cuff with a sewn-on button will not take them." },
          { q: "Can I wear them with shalwar kameez?", a: "Yes. Many kameez are stitched with cufflink cuffs, and any tailor can make them that way. See our matching guide in the Journal for colours." },
          { q: "Do they come in a gift box?", a: "Yes. Every pair arrives in a black velvet presentation box." },
          { q: "Do you offer engraving?", a: "Not at the moment." },
          { q: "What if my order arrives damaged?", a: "Message us on WhatsApp with a photo and we will replace it at no cost. See Returns and replacements." },
          { q: "Can I order on WhatsApp?", a: `Yes. Message ${WHATSAPP_DISPLAY}, or use the Order on WhatsApp button on any product or in your bag.` },
        ],
      },
    ],
    whatsapp: "Assalam o Alaikum, I have a question.",
  },

  contact: {
    title: "Contact us",
    description: "Reach SANWARNA on WhatsApp.",
    intro: `The fastest way to reach us is WhatsApp: ${WHATSAPP_DISPLAY}.`,
    sections: [
      {
        heading: "We can help with",
        list: ["Choosing a colour", "More photos or a video of a piece", "Placing an order in the chat", "An order you have already placed"],
      },
    ],
    whatsapp: "Assalam o Alaikum, I have a question about SANWARNA.",
  },

  privacy: {
    title: "Privacy policy",
    description: "What information SANWARNA collects when you order, and how it is used.",
    intro: "This page explains, in plain words, what information we collect and what we do with it.",
    sections: [
      {
        heading: "What we collect",
        body: ["When you place an order we collect your name, phone number, email address, delivery address and what you ordered. If you message us on WhatsApp, we see your number and the messages you send."],
      },
      {
        heading: "How we use it",
        list: ["To confirm, pack and deliver your order.", "To contact you about that order.", "To keep a record of orders for our accounts."],
      },
      {
        heading: "Who we share it with",
        body: [
          "We share your name, phone number and address with the courier that delivers your parcel. If you pay by JazzCash, the payment is handled on JazzCash's own page; we do not see or store your wallet PIN or card number.",
          "We do not sell your information or pass it to advertisers.",
        ],
      },
      {
        heading: "Your choices",
        body: ["You can ask us to correct or delete the details we hold about you by messaging us on WhatsApp."],
      },
      {
        heading: "This site",
        body: ["Your bag is saved in your own browser so it is still there when you come back. We do not use advertising trackers."],
      },
    ],
  },

  terms: {
    title: "Terms of sale",
    description: "The terms that apply when you order from SANWARNA.",
    sections: [
      { heading: "Orders", body: ["An order is accepted once we have confirmed it with you by call or WhatsApp. We may decline an order we cannot confirm or cannot fulfil, for example if an item is out of stock."] },
      { heading: "Prices", body: ["All prices are in Pakistani Rupees and include delivery within Pakistan. The price that applies is the one shown when you place your order."] },
      { heading: "Payment", body: ["You can pay by Cash on Delivery or JazzCash. With Cash on Delivery, payment is due to the courier when the parcel is delivered."] },
      { heading: "Delivery", body: ["We deliver within Pakistan. Delivery dates we give are estimates; we will tell you if there is a delay."] },
      { heading: "Damaged or incorrect items", body: ["If your order arrives damaged or is not what you ordered, tell us on WhatsApp with a photo and we will replace it at no cost to you."] },
      { heading: "Product photos", body: ["We photograph the real pieces. Colours can look slightly different on different screens and under different light."] },
      { heading: "Contact", body: [`Questions about these terms: WhatsApp ${WHATSAPP_DISPLAY}.`] },
    ],
  },
};
