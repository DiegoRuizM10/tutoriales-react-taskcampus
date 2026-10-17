
import { useState } from 'react'
import { useTareas } from './hooks/useTareas'
import './App.css'

function App() {
  const {
    tareas,
    cargando,
    error,
    agregarTarea,
    cambiarEstado,
    eliminarTarea,
    editarTarea,
  } = useTareas()

  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  function manejarAgregar(e) {
    e.preventDefault()

    if (!nuevoTitulo.trim()) return

    agregarTarea(nuevoTitulo)
    setNuevoTitulo('')
  }

  const tareasVisibles = tareas.filter((tarea) => {
    const coincideBusqueda = tarea.titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase())

    const coincideFiltro =
      filtro === 'todas' ||
      (filtro === 'pendientes' && !tarea.completada) ||
      (filtro === 'completadas' && tarea.completada)

    return coincideBusqueda && coincideFiltro
  })

  const pendientes = tareas.filter((tarea) => !tarea.completada).length
  const completadas = tareas.filter((tarea) => tarea.completada).length

  function manejarEditar(tarea) {
    const titulo = prompt('Escribe el nuevo título de la tarea:')

    if (titulo?.trim()) {
      editarTarea(tarea.id, titulo)
    }
  }

  function manejarEliminar(id) {
    if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
      eliminarTarea(id)
    }
  }

  return (
    <main className="app">
      <header className="encabezado">
        <div>
          <p className="etiqueta">ORGANIZACIÓN ACADÉMICA</p>
          <h1>TaskCampus</h1>
          <p className="subtitulo">
            Organiza tus tareas. Avanza a tu ritmo.
          </p>
        </div>
      </header>

      <section className="resumen">
        <article className="tarjeta">
          <span>Total de tareas</span>
          <strong>{tareas.length}</strong>
        </article>
        <article className="tarjeta">
          <span>Pendientes</span>
          <strong>{pendientes}</strong>
        </article>
        <article className="tarjeta">
          <span>Completadas</span>
          <strong>{completadas}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Nueva tarea</h2>

        <form className="formulario" onSubmit={manejarAgregar}>
          <input
            type="text"
            placeholder="Ej. Estudiar para el examen..."
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />
          <button type="submit">Agregar tarea</button>
        </form>

        <h2 className="titulo-lista">Mis tareas</h2>

        <input
          className="busqueda"
          type="search"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="filtros">
          {['todas', 'pendientes', 'completadas'].map((opcion) => (
            <button
              key={opcion}
              className={filtro === opcion ? 'activo' : ''}
              onClick={() => setFiltro(opcion)}
              type="button"
            >
              {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
            </button>
          ))}
        </div>

        {cargando && <p className="vacio">Cargando tareas...</p>}

        {error && <p className="vacio">Error: {error}</p>}

        {!cargando && !error && (
          <>
            <p className="cantidad">
              Mostrando {tareasVisibles.length} de {tareas.length} tareas
            </p>

            <ul className="lista-tareas">
              {tareasVisibles.map((tarea) => (
                <li className="tarea" key={tarea.id}>
                  <label
                    className={
                      tarea.completada ? 'texto-completado' : ''
                    }
                  >
                    <input
                      type="checkbox"
                      checked={tarea.completada}
                      onChange={() => cambiarEstado(tarea.id)}
                    />
                    {tarea.titulo}
                  </label>

                  <div className="acciones">
                    <button
                      type="button"
                      className="boton-editar"
                      onClick={() => manejarEditar(tarea)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() => manejarEliminar(tarea.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {tareasVisibles.length === 0 && (
              <p className="vacio">No se encontraron tareas.</p>
            )}
          </>
        )}
      </section>

      <footer>
        <p>TaskCampus · Tu espacio de organización académica</p>
      </footer>
    </main>
  )
}

export default App
