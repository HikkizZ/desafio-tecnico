import { useMemo, useState, type ReactNode } from 'react'
import { Truck, Sparkles, ListChecks } from 'lucide-react'
import type { Package } from './types/index.js'
import { cn, formatCurrency } from './lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './components/ui/Card'
import { AddPackageForm } from './components/AddPackageForm'
import { SimularPanel } from './components/SimularPanel'
import { VerificarPanel } from './components/VerificarPanel'

type Flujo = 'simular' | 'verificar'

function App() {
  const [packages, setPackages] = useState<Package[]>([])
  const [capacity, setCapacity] = useState(0)
  const [flujo, setFlujo] = useState<Flujo>('simular')
  const [contador, setContador] = useState(0)

  const addPackage = (weight: number, value: number) => {
    const nuevo: Package = {
      id: `PKG-${String(contador + 1).padStart(2, '0')}`,
      weight,
      value,
    }
    setPackages((prev) => [...prev, nuevo])
    setContador((c) => c + 1)
  }

  const removePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  const { totalWeight, totalValue } = useMemo(() => {
    return {
      totalWeight: packages.reduce((s, p) => s + p.weight, 0),
      totalValue: packages.reduce((s, p) => s + p.value, 0),
    }
  }, [packages])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Operación Logística de Última Milla</h1>
            <p className="text-xs text-muted-foreground">
              Optimización de carga para furgonetas
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <SummaryTile
            label="Paquetes"
            value={String(packages.length)}
            hint="en el inventario"
          />
          <SummaryTile
            label="Peso total"
            value={`${totalWeight.toLocaleString('es-ES')} kg`}
            hint="de todos los paquetes"
          />
          <SummaryTile
            label="Valor total"
            value={formatCurrency(totalValue)}
            hint="del inventario completo"
          />
        </section>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agregar paquete</CardTitle>
            <CardDescription>
              Registra un paquete con su peso y valor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddPackageForm onAdd={addPackage} />
          </CardContent>
        </Card>

        <div className="mb-5 inline-flex rounded-xl border border-border bg-card p-1">
          <TabButton
            active={flujo === 'simular'}
            onClick={() => setFlujo('simular')}
            icon={<Sparkles className="h-4 w-4" />}
          >
            Simular
          </TabButton>
          <TabButton
            active={flujo === 'verificar'}
            onClick={() => setFlujo('verificar')}
            icon={<ListChecks className="h-4 w-4" />}
          >
            Verificar
          </TabButton>
        </div>

        {flujo === 'simular' ? (
          <SimularPanel
            packages={packages}
            capacity={capacity}
            onCapacityChange={setCapacity}
            onDelete={removePackage}
          />
        ) : (
          <VerificarPanel
            packages={packages}
            capacity={capacity}
            onCapacityChange={setCapacity}
          />
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        Desafío Técnico - Gestión de carga para furgonetas.
      </footer>
    </div>
  )
}

function SummaryTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export default App
