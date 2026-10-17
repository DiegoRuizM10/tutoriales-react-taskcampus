function TaskList({ tareas, onCambiarEstado, onEditar, onEliminar }) {
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
                onChange={() => onCambiarEstado(id)}
                aria-label="Cambiar estado de la tarea"
              />

              <span
                className={`tarea-titulo ${
                  completada ? 'tarea-completada' : ''
                }`}
              >
                {titulo || 'Tarea sin título'}
              </span>
            </div>

            <div className="acciones-tarea">
              <button
                type="button"
                className="boton-editar"
                onClick={() => onEditar(id, titulo)}
              >
                Editar
              </button>

              <button
                type="button"
                className="boton-eliminar"
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
