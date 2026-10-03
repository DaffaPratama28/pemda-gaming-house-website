type Props = {
  label: string
  value: number
  accent: string
}

/** Satu baris stat (label, angka, bar). `.stat-fill` dianimasikan oleh section induk. */
export function StatBar({ label, value, accent }: Props) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
      <dt className="hud text-smoke">{label}</dt>
      <dd className="hud text-bone tabular-nums">{value}</dd>
      <dd aria-hidden="true" className="col-span-2 h-[3px] overflow-hidden bg-bone/10">
        <span
          className="stat-fill block h-full origin-left"
          style={{ width: `${value}%`, backgroundColor: accent }}
        />
      </dd>
    </div>
  )
}
