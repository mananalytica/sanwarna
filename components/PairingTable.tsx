import { ALL_PAIRINGS } from "@/lib/pairing";

/** Colour-by-colour matching guide (shirts and shalwar kameez). */
export default function PairingTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-mist text-steel">
          <tr>
            {["Stone", "Shirts", "Shalwar kameez", "Avoid", "Best for"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_PAIRINGS.map((p) => (
            <tr key={p.colour} className="border-t border-hairline align-top text-graphite/80">
              <th scope="row" className="px-4 py-3 font-medium text-graphite">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm border border-hairline" style={{ backgroundColor: p.swatch }} />
                  {p.colour}
                </span>
              </th>
              <td className="px-4 py-3">{p.shirts}</td>
              <td className="px-4 py-3">{p.kameez}</td>
              <td className="px-4 py-3">{p.avoid}</td>
              <td className="px-4 py-3">{p.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
