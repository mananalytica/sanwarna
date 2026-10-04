import { NextResponse } from "next/server";
import { buildOrder, saveOrder } from "@/lib/orders";
import { jazzCashRequest } from "@/lib/jazzcash";

export async function POST(req: Request) {
  const order = await buildOrder(await req.json().catch(() => ({})), "jazzcash");
  if ("error" in order) return NextResponse.json(order, { status: 400 });
  const request = jazzCashRequest(order);
  if (!request) {
    return NextResponse.json(
      { error: "JazzCash isn't available right now. Please choose Cash on Delivery." },
      { status: 503 }
    );
  }
  if (!(await saveOrder(order))) {
    return NextResponse.json(
      { error: "We couldn't record your order just now. Please try again in a moment." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ...request, order });
}
