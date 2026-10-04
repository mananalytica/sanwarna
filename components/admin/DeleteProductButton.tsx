"use client";

import { deleteProductAction } from "@/app/admin/actions";

/** Delete with an "are you sure?" step, for the admin products list. */
export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${name}"? This removes it from the shop and can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-rust underline-offset-4 hover:underline">
        Delete
      </button>
    </form>
  );
}
