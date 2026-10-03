import { NextResponse } from "next/server";
import { buildOrder, saveOrder } from "@/lib/orders";

export async function POST(req: Request) {
  const order = await buildOrder(await req.json().catch(() => ({})), "cod");
  if ("error" in order) return NextResponse.json(order, { status: 400 });
  if (!(await saveOrder(order))) {
    return NextResponse.json(
      { error: "We couldn't record your order just now. Please try again in a moment." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ref: order.ref });
}
