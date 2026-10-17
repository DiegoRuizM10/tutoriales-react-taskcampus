import { useState } from 'react'

function TaskList({
  tareas,
  onCambiarEstado,
  onEditar,
  onEliminar,
  guardando = false
}) {
  const [editandoId, setEditandoId] = useState(null)
  const [tituloEditado, setTituloEditado] = useState('')

  function iniciarEdicion(id, titulo) {
    if (guardando) return

    setEditandoId(id)
    setTituloEditado(titulo)
  }

  async function guardarEdicion(id) {
    if (editandoId !== id || guardando) return

    const nuevoTitulo = tituloEditado.trim()

    if (!nuevoTitulo) {
      cancelarEdicion()
      return
    }

    const tareaActual = tareas.find((tarea) => tarea.id === id)
    const tituloActual = String(
      tareaActual?.title ?? tareaActual?.titulo ?? ''
    )

    setEditandoId(null)

    if (nuevoTitulo !== tituloActual) {
      await onEditar(id, nuevoTitulo)
    }
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setTituloEditado('')
  }

  if (tareas.length === 0) {
    return (
      <p className="sin-tareas">
        No hay tareas para mostrar.
      </p>
    )
  }

  return (
    <ul className="lista-tareas">
      {tareas.map((tarea) => {
        const id = tarea.id
        const titulo = String(tarea.title ?? tarea.titulo ?? '')
        const completada =
          tarea.completed ?? tarea.completada ?? false

        return (
          <li className="tarea" key={id}>
            <div className="tarea-contenido">
              <input
                className="tarea-checkbox"
                type="checkbox"
                checked={completada}
                disabled={guardando}
                onChange={() => onCambiarEstado(id)}
                aria-label="Cambiar estado de la tarea"
              />

              {editandoId === id ? (
                <input
                  className="tarea-edicion"
                  type="text"
                  value={tituloEditado}
                  disabled={guardando}
                  onChange={(evento) =>
                    setTituloEditado(evento.target.value)
                  }
                  onBlur={() => guardarEdicion(id)}
                  onKeyDown={(evento) => {
                    if (evento.key === 'Enter') {
                      evento.preventDefault()
                      guardarEdicion(id)
                    }

                    if (evento.key === 'Escape') {
                      cancelarEdicion()
                    }
                  }}
                  autoFocus
                  aria-label="Editar título de la tarea"
                />
              ) : (
                <span
                  className={`tarea-titulo ${
                    completada ? 'tarea-completada' : ''
                  }`}
                  onDoubleClick={() => iniciarEdicion(id, titulo)}
                  title="Haz doble clic para editar"
                  style={{
                    cursor: guardando ? 'default' : 'text'
                  }}
                >
                  {titulo || 'Tarea sin título'}
                </span>
              )}
            </div>

            <div className="acciones-tarea">
              <button
                type="button"
                className="boton-editar"
                disabled={guardando}
                onClick={() => iniciarEdicion(id, titulo)}
              >
                Editar
              </button>

              <button
                type="button"
                className="boton-eliminar"
                disabled={guardando}
                onClick={() => onEliminar(id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TaskList