import { useState } from 'react'
import './App.css'
import type { Package, PlanResponse, VerifyResponse } from './types/index.js';
import { planLoad, verifyLoad } from './api/logistics.js';

function App() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [capacity, setCapacity] = useState<number>(0);
  const [form, setForm] = useState({ id: '', weight: '', value: '' });
  const [manualSelected, setManualSelected] = useState<string[]>([]);
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addPackage() {
    if (!form.id || !form.weight || !form.value) return;

    setPackages([...packages, { id: form.id, weight: Number(form.weight), value: Number(form.value) }]);
    setForm({ id: '', weight: '', value: '' });
  }

  function removePackage(id: string) {
    setPackages(packages.filter(p => p.id !== id));
    setManualSelected(manualSelected.filter(s => s !== id));
  };

  function toggleSelect(id: string) {
    setManualSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  async function simulate() {
    setError(null);
    setResult(null);
    setVerifyResult(null);

    if (capacity <= 0) {
      setError('La capacidad debe ser mayor a 0');
      return;
    }

    if (packages.length === 0) {
      setError('Debe agregar al menos un paquete antes de simular');
      return;
    }

    try {
      const data = await planLoad(capacity, packages);
      setResult(data);
    } catch {
      setError('Internal Server Error');
    }
  }

  async function verify() {
    setError(null);
    setVerifyResult(null);

    const selectedPkgs = packages.filter(p => manualSelected.includes(p.id));
    const totalWeight = selectedPkgs.reduce((sum, p) => sum + p.weight, 0);

    if (totalWeight > capacity) {
      setError('¡Exceso de capacidad! Riesgo de seguridad en ruta');
      return;
    }

    try {
      const data = await verifyLoad(capacity, manualSelected, packages);
      setVerifyResult(data);
    } catch {
      setError('Internal Server Error');
    }
  }

  return (
    <div className="container">
      <h1>Gestión de Paquetes</h1>

      <section>
        <h2>Configuración de carga</h2>
        <input
          type="number"
          placeholder="Capacidad máxima (kg)"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />
      </section>
      
      <section>
        <h2>Agregar Paquete</h2>
        <input
          placeholder="ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
        <input
          type="number"
          placeholder="Valor"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />
        <button onClick={addPackage}>Agregar</button>
      </section>

      <section>
        <h2>Paquetes del día</h2>
        {packages.length === 0 && <p>No hay paquetes agregados.</p>}
        <ul>
          {packages.map(p => (
            <li key={p.id}>
                <input
                  type="checkbox"
                  checked={manualSelected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              {p.id} - Peso: {p.weight} kg, Valor: {p.value}
              <button onClick={() => removePackage(p.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <button onClick={verify} disabled={manualSelected.length === 0}>Verificar Selección Manual</button>
      </section>

      <button onClick={simulate}>Simular Carga</button>

      {error && <div className="alert">{error}</div>}

      {result && (
        <div className="result">
          <h2>Resultado de la Simulación</h2>
          <p>Paquetes seleccionados: {result.selected_packages.join(', ')}</p>
          <p>Valor total: {result.total_value}</p>
          <p>Peso total: {result.total_weight} kg</p>
        </div>
      )}

      {verifyResult && (
        <div className="result">
          <h2>Resultado de la selección manual</h2>
          <p>{verifyResult.message}</p>
          {!verifyResult.optimal && 
            <p>Mejor valor posible: {verifyResult.best_possible_value}</p>}
        </div>
      )}
    </div>
  );
}

export default App
