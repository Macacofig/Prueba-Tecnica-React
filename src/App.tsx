import { useState } from 'react'
import './App.css'
import { useToast } from './toast'

function App() {
  const toast = useToast()
  const [durationInSeconds, setDurationInSeconds] = useState(3)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const handleDurationChange = (value: string) => {
    const parsed = Number(value)
    setDurationInSeconds(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
  }

  return (
    <main className="demo" data-theme={theme}>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>Notifica<span className="brand-accent">.</span></span>
        </a>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          aria-pressed={theme === 'dark'}
        >
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>
      </header>

      <section className="demo-content" id="inicio">
        <div className="eyebrow"><span className="status-dot" /> DEMO INTERACTIVA</div>
        <h1>Mensajes que<br /><span>se hacen notar.</span></h1>
        <p className="intro">Prueba las notificaciones y encuentra el estilo que mejor comunica cada momento.</p>

        <section className="control-card" aria-labelledby="controls-title">
          <div className="card-heading">
            <div>
              <span className="section-label">PERSONALIZA</span>
              <h2 id="controls-title">Configura tu notificación</h2>
            </div>
          </div>

          <label className="demo-duration" htmlFor="duration">
            <span><strong>Duración</strong><small>Tiempo visible en pantalla</small></span>
            <span className="input-wrap">
              <input
                id="duration"
                type="number"
                min="0"
                step="0.1"
                value={durationInSeconds}
                onChange={(event) => handleDurationChange(event.target.value)}
              />
              <span className="input-unit">seg</span>
            </span>
          </label>

          <div className="divider" />
          <div className="actions-heading">
            <span><strong>Elige un tipo</strong><small>Haz clic para ver la vista previa</small></span>
          </div>
          <div className="demo-actions">
            <button className="action-button success" type="button" onClick={() => toast.show({ type: 'success', message: 'Guardado correctamente' })}>
              <span className="action-icon" aria-hidden="true">✓</span><span>Éxito</span><span className="button-arrow" aria-hidden="true">↗</span>
            </button>
            <button className="action-button error" type="button" onClick={() => toast.show({ type: 'error', message: 'Ocurrió un error' })}>
              <span className="action-icon" aria-hidden="true">!</span><span>Error</span><span className="button-arrow" aria-hidden="true">↗</span>
            </button>
            <button className="action-button custom" type="button" onClick={() => toast.show({ type: 'success', message: `Duración personalizada: ${durationInSeconds} s`, duration: Math.round(durationInSeconds * 1000) })}>
              <span className="action-icon" aria-hidden="true">◷</span><span>Personalizada</span><span className="button-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </section>
      <footer className="footer"><span>NOTIFICA<span className="brand-accent">.</span></span><span>Una mejor forma de informar.</span></footer>
    </main>
  )
}

export default App
