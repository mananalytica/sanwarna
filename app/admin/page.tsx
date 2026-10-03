import { redirect } from "next/navigation";

// Signing in lands here; products are the main job.
export default function AdminHome() {
  redirect("/admin/products");
}
