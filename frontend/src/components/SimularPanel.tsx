import { useState } from "react"
import { Zap, Weight, Coins, Boxes, AlertTriangle } from "lucide-react"
import type { Package, PlanResponse } from "@/types/index.js"
import { planLoad } from "@/api/logistics.js"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { PackagesTable } from "./PackagesTable"
import { StatCard } from "./StatCard"

interface SimularPanelProps {
  packages: Package[]
  capacity: number
  onCapacityChange: (value: number) => void
  onDelete?: (id: string) => void
}

export function SimularPanel({
  packages,
  capacity,
  onCapacityChange,
  onDelete,
}: SimularPanelProps) {
  const [result, setResult] = useState<PlanResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSimular = async () => {
    setError(null)
    setResult(null)

    if (capacity <= 0) {
      setError("La capacidad debe ser mayor a 0")
      return
    }
    if (packages.length === 0) {
      setError("Debe agregar al menos un paquete antes de simular")
      return
    }

    try {
      const data = await planLoad(capacity, packages)
      setResult(data)
    } catch {
      setError("Internal Server Error")
    }
  }

  const highlightedIds = result ? new Set(result.selected_packages) : undefined

  const utilizacion =
    result && capacity > 0
      ? Math.min(100, Math.round((result.total_weight / capacity) * 100))
      : 0

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Lista de paquetes</CardTitle>
          <CardDescription>
            La optimización selecciona automáticamente la mejor combinación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PackagesTable
            packages={packages}
            highlightedIds={highlightedIds}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Capacidad de la furgoneta</CardTitle>
            <CardDescription>Peso máximo transportable.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label
                  htmlFor="capacidad"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Capacidad (kg)
                </label>
                <Input
                  id="capacidad"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={capacity === 0 ? "" : capacity}
                  onChange={(e) =>
                    onCapacityChange(Number.parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <Button onClick={handleSimular} disabled={packages.length === 0}>
              <Zap className="h-4 w-4" />
              Simular carga
            </Button>
            {error ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Resultado óptimo</CardTitle>
              <CardDescription>
                {result.selected_packages.length} de {packages.length} paquetes
                · {utilizacion}% de la capacidad
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard
                  label="Valor total"
                  value={formatCurrency(result.total_value)}
                  icon={<Coins className="h-5 w-5" />}
                  tone="success"
                />
                <StatCard
                  label="Peso total"
                  value={`${result.total_weight.toLocaleString("es-ES")} kg`}
                  hint={`de ${capacity.toLocaleString("es-ES")} kg`}
                  icon={<Weight className="h-5 w-5" />}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Boxes className="h-4 w-4 text-muted-foreground" />
                  Paquetes seleccionados
                </div>
                {result.selected_packages.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.selected_packages.map((id) => (
                      <span
                        key={id}
                        className="rounded-md bg-success/15 px-2 py-1 font-mono text-xs font-medium text-success"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ningún paquete cabe en la capacidad indicada.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
