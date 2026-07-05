import { Trash2, PackageOpen } from "lucide-react"
import type { Package } from "@/types/index.js"
import { cn, formatCurrency } from "@/lib/utils"

interface PackagesTableProps {
  packages: Package[]
  onDelete?: (id: string) => void
  /** Modo selección: muestra checkboxes */
  selectable?: boolean
  selectedIds?: Set<string>
  onToggle?: (id: string) => void
  /** Resalta filas incluidas en el resultado (modo simular) */
  highlightedIds?: Set<string>
}

export function PackagesTable({
  packages,
  onDelete,
  selectable = false,
  selectedIds,
  onToggle,
  highlightedIds,
}: PackagesTableProps) {
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 py-12 text-center">
        <PackageOpen className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No hay paquetes</p>
        <p className="text-xs text-muted-foreground">
          Agrega paquetes con el formulario de arriba.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            {selectable ? <th className="w-12 px-4 py-3" /> : null}
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 text-right font-medium">Peso (kg)</th>
            <th className="px-4 py-3 text-right font-medium">Valor</th>
            {onDelete ? <th className="w-12 px-4 py-3" /> : null}
          </tr>
        </thead>
        <tbody>
          {packages.map((p) => {
            const selected = selectedIds?.has(p.id)
            const highlighted = highlightedIds?.has(p.id)
            return (
              <tr
                key={p.id}
                className={cn(
                  "border-t border-border transition-colors",
                  selectable && "cursor-pointer",
                  selected && "bg-primary/5",
                  highlighted && "bg-success/10",
                  !selected && !highlighted && "hover:bg-muted/40",
                )}
                onClick={selectable ? () => onToggle?.(p.id) : undefined}
              >
                {selectable ? (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                      checked={selected ?? false}
                      onChange={() => onToggle?.(p.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Seleccionar paquete ${p.id}`}
                    />
                  </td>
                ) : null}
                <td className="px-4 py-3 font-mono font-medium">{p.id}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {p.weight.toLocaleString("es-ES")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrency(p.value)}
                </td>
                {onDelete ? (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(p.id)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Eliminar paquete ${p.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
