import { useState } from 'react'
import './App.css'
import { useToast } from './toast'

function App() {
  const toast = useToast()
  const [durationInSeconds, setDurationInSeconds] = useState(3)

  const handleDurationChange = (value: string) => {
    const parsed = Number(value)
    setDurationInSeconds(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
  }

  return (
    <main className="demo">
      <h1>Sistema de Toasts</h1>
      <p>Presiona un botón para mostrar una notificación.</p>

      <label className="demo-duration">
        Duración (s):
        <input
          type="number"
          min="0"
          step="0.1"
          value={durationInSeconds}
          onChange={(event) => handleDurationChange(event.target.value)}
        />
      </label>

      <div className="demo-actions">
        <button
          type="button"
          onClick={() =>
            toast.show({
              type: 'success',
              message: 'Guardado correctamente',
            })
          }
        >
          Success
        </button>

        <button
          type="button"
          onClick={() =>
            toast.show({
              type: 'error',
              message: 'Ocurrió un error',
            })
          }
        >
          Error
        </button>

        <button
          type="button"
          onClick={() =>
            toast.show({
              type: 'success',
              message: `Duración personalizada: ${durationInSeconds} s`,
              duration: Math.round(durationInSeconds * 1000),
            })
          }
        >
          Custom
        </button>
      </div>
    </main>
  )
}

export default App
