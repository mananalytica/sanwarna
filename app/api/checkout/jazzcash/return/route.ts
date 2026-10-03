import { NextResponse } from "next/server";
import { verifyJazzCashResponse } from "@/lib/jazzcash";
import { getOrderTotal, setOrderStatus } from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

// JazzCash posts the shopper back here after they pay (or cancel).
export async function POST(req: Request) {
  const form = await req.formData();
  const fields: Record<string, string> = {};
  form.forEach((v, k) => (fields[k] = String(v)));

  const result = verifyJazzCashResponse(fields);
  const { genuine } = result;
  let { paid } = result;
  const ref = fields.pp_TxnRefNo ?? "";
  if (paid) {
    // The amount JazzCash collected must match what the order was for.
    const total = await getOrderTotal(ref);
    if (total !== null && Number(fields.pp_Amount) !== total * 100) {
      console.error("[jazzcash] amount mismatch", ref, fields.pp_Amount, total);
      paid = false;
    }
  }
  if (genuine) {
    await setOrderStatus(ref, paid ? "paid" : "payment-failed");
  } else {
    console.error("[jazzcash] response failed the hash check", ref);
  }
  const status = paid ? "paid" : "failed";
  return NextResponse.redirect(`${SITE_URL}/checkout/result?status=${status}&ref=${encodeURIComponent(ref)}`, 303);
}
