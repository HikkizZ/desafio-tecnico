import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Weight,
  Coins,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from "lucide-react"
import type { Package, VerifyResponse } from "@/types/index.js"
import { verifyLoad } from "@/api/logistics.js"
import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { PackagesTable } from "./PackagesTable"
import { StatCard } from "./StatCard"

interface VerificarPanelProps {
  packages: Package[]
  capacity: number
  onCapacityChange: (value: number) => void
}

export function VerificarPanel({
  packages,
  capacity,
  onCapacityChange,
}: VerificarPanelProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [verification, setVerification] = useState<VerifyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setVerification(null)
  }

  const { selectedWeight, selectedValue } = useMemo(() => {
    let weight = 0
    let value = 0
    for (const p of packages) {
      if (selectedIds.has(p.id)) {
        weight += p.weight
        value += p.value
      }
    }
    return { selectedWeight: weight, selectedValue: value }
  }, [packages, selectedIds])

  const excede = selectedWeight > capacity && capacity > 0

  const handleVerificar = async () => {
    setError(null)
    setVerification(null)

    if (excede) {
      setError("¡Exceso de capacidad! Riesgo de seguridad en ruta")
      return
    }

    try {
      const data = await verifyLoad(capacity, Array.from(selectedIds), packages)
      setVerification(data)
    } catch {
      setError("Internal Server Error")
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-5">
        {excede ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">¡Exceso de capacidad!</p>
              <p className="text-sm text-destructive/90">
                La selección pesa {selectedWeight.toLocaleString("es-ES")} kg y
                supera la capacidad de {capacity.toLocaleString("es-ES")} kg.
                Quita algún paquete para continuar.
              </p>
            </div>
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Selección manual</CardTitle>
            <CardDescription>
              Marca los paquetes que quieres cargar en la furgoneta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackagesTable
              packages={packages}
              selectable
              selectedIds={selectedIds}
              onToggle={toggle}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Capacidad de la furgoneta</CardTitle>
            <CardDescription>Peso máximo transportable.</CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="capacidad-manual"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Capacidad (kg)
            </label>
            <Input
              id="capacidad-manual"
              type="number"
              min="0"
              inputMode="decimal"
              value={capacity === 0 ? "" : capacity}
              onChange={(e) =>
                onCapacityChange(Number.parseFloat(e.target.value) || 0)
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selección actual</CardTitle>
            <CardDescription>
              {selectedIds.size} paquete{selectedIds.size === 1 ? "" : "s"}{" "}
              marcado{selectedIds.size === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Peso acumulado"
                value={`${selectedWeight.toLocaleString("es-ES")} kg`}
                hint={`de ${capacity.toLocaleString("es-ES")} kg`}
                icon={<Weight className="h-5 w-5" />}
                tone={excede ? "destructive" : "default"}
              />
              <StatCard
                label="Valor acumulado"
                value={formatCurrency(selectedValue)}
                icon={<Coins className="h-5 w-5" />}
                tone="success"
              />
            </div>

            <Button
              onClick={handleVerificar}
              disabled={packages.length === 0 || selectedIds.size === 0}
            >
              <ClipboardCheck className="h-4 w-4" />
              Verificar selección
            </Button>

            {error ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            {verification ? (
              verification.optimal ? (
                <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{verification.message}</p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/15 p-3 text-sm text-warning-foreground">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">{verification.message}</p>
                    {verification.best_possible_value !== undefined ? (
                      <p>
                        Mejor valor posible:{" "}
                        <span className="font-semibold">
                          {formatCurrency(verification.best_possible_value)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
