
function TaskList({
  tareas,
  onCambiarEstado,
  onEditar,
  onEliminar,
}) {
  if (tareas.length === 0) {
    return <p className="vacio">No se encontraron tareas.</p>
  }

  return (
    <ul className="lista-tareas">
      {tareas.map((tarea) => (
        <li className="tarea" key={tarea.id}>
          <label
            className={
              tarea.completada ? 'texto-completado' : ''
            }
          >
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => onCambiarEstado(tarea.id)}
            />
            {tarea.titulo}
          </label>

          <div className="acciones">
            <button
              type="button"
              className="boton-editar"
              onClick={() => onEditar(tarea)}
            >
              Editar
            </button>

            <button
              type="button"
              className="boton-eliminar"
              onClick={() => onEliminar(tarea.id)}
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
