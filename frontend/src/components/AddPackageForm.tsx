import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface AddPackageFormProps {
  onAdd: (weight: number, value: number) => void
}

export function AddPackageForm({ onAdd }: AddPackageFormProps) {
  const [weight, setWeight] = useState("")
  const [value, setValue] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const w = Number.parseFloat(weight)
    const v = Number.parseFloat(value)
    if (!Number.isFinite(w) || w <= 0) return
    if (!Number.isFinite(v) || v < 0) return
    onAdd(w, v)
    setWeight("")
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="weight"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Peso (kg)
        </label>
        <Input
          id="weight"
          type="number"
          min="0"
          inputMode="decimal"
          placeholder="p. ej. 12"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="value"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Valor
        </label>
        <Input
          id="value"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="p. ej. 300"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" className="sm:w-auto">
        <Plus className="h-4 w-4" />
        Agregar paquete
      </Button>
    </form>
  )
}
