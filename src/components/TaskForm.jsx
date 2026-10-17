import { useState } from 'react'

function TaskForm({ onAgregarTarea }) {
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [error, setError] = useState('')

  function manejarSubmit(evento) {
    evento.preventDefault()

    const tituloLimpio = nuevoTitulo.trim()

    if (!tituloLimpio) {
      setError('Escribe un título para la tarea.')
      return
    }

    onAgregarTarea(tituloLimpio)
    setNuevoTitulo('')
    setError('')
  }

  return (
    <section className="panel">
      <h2>Nueva tarea</h2>

      <form className="formulario" onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Escribe una tarea académica..."
          value={nuevoTitulo}
          onChange={(evento) => {
            setNuevoTitulo(evento.target.value)
            setError('')
          }}
        />

        <button type="submit">
          Agregar tarea
        </button>
      </form>

      {error && (
        <p className="mensaje-error">
          {error}
        </p>
      )}
    </section>
  )
}

export default TaskForm
