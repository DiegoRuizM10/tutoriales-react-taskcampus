import { useState } from 'react'
import { useTareas } from './hooks/useTareas'
import Header from './components/Header'
import Card from './components/Card'
import Modal from './components/Modal'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskSummary from './components/TaskSummary'
import './App.css'

function App() {
  const {
    tareas,
    cargando,
    guardando,
    error,
    agregarTarea,
    cambiarEstado,
    eliminarTarea,
    editarTarea
  } = useTareas()

  const [usuario, setUsuario] = useState('Estudiante')
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [tareaPorEliminar, setTareaPorEliminar] = useState(null)

  function manejarEditarTarea(id, tituloActual) {
    const nuevoTitulo = window.prompt(
      'Escribe el nuevo título:',
      tituloActual
    )

    if (nuevoTitulo !== null && nuevoTitulo.trim() !== '') {
      editarTarea(id, nuevoTitulo.trim())
    }
  }

  function manejarEliminarTarea(id) {
    if (guardando) return

    const tarea = tareasSeguras.find((item) => item.id === id)

    if (tarea) {
      setTareaPorEliminar(tarea)
    }
  }

  async function confirmarEliminarTarea() {
    if (!tareaPorEliminar || guardando) return

    const eliminada = await eliminarTarea(tareaPorEliminar.id)

    if (eliminada !== false) {
      setTareaPorEliminar(null)
    }
  }

  const tareasSeguras = Array.isArray(tareas) ? tareas : []

  const tareasFiltradas = tareasSeguras.filter((tarea) => {
    const titulo = String(tarea.title ?? tarea.titulo ?? '')
    const completada =
      tarea.completed ?? tarea.completada ?? false

    const coincideBusqueda = titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase())

    const coincideFiltro =
      filtro === 'todas' ||
      (filtro === 'pendientes' && !completada) ||
      (filtro === 'completadas' && completada)

    return coincideBusqueda && coincideFiltro
  })

  const pendientes = tareasSeguras.filter(
    (tarea) => !(tarea.completed ?? tarea.completada ?? false)
  ).length

  const completadas = tareasSeguras.filter(
    (tarea) => tarea.completed ?? tarea.completada ?? false
  ).length

  return (
    <main className="app">
      <Header
        usuario={usuario}
        onCambiarUsuario={() =>
          setUsuario('Estudiante Anónimo')
        }
      />

      <TaskSummary
        total={tareasSeguras.length}
        pendientes={pendientes}
        completadas={completadas}
      />

      <TaskForm onAgregarTarea={agregarTarea} />

      <Card titulo="Mis tareas">
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          disabled={cargando}
        />

        <div className="filtros">
          <button
            type="button"
            className={filtro === 'todas' ? 'filtro-activo' : ''}
            onClick={() => setFiltro('todas')}
            disabled={guardando}
          >
            Todas
          </button>

          <button
            type="button"
            className={
              filtro === 'pendientes' ? 'filtro-activo' : ''
            }
            onClick={() => setFiltro('pendientes')}
            disabled={guardando}
          >
            Pendientes
          </button>

          <button
            type="button"
            className={
              filtro === 'completadas' ? 'filtro-activo' : ''
            }
            onClick={() => setFiltro('completadas')}
            disabled={guardando}
          >
            Completadas
          </button>
        </div>

        {cargando && <p>Cargando tareas...</p>}

        {guardando && (
          <p className="mensaje-carga" role="status">
            Guardando cambios...
          </p>
        )}

        {error && (
          <p className="mensaje-error" role="alert">
            {String(error)}
          </p>
        )}

        {!cargando && (
          <TaskList
            tareas={tareasFiltradas}
            onCambiarEstado={cambiarEstado}
            onEditar={manejarEditarTarea}
            onEliminar={manejarEliminarTarea}
            guardando={guardando}
          />
        )}

        {!cargando && (
          <p>
            Tareas visibles: {tareasFiltradas.length} de{' '}
            {tareasSeguras.length}
          </p>
        )}
      </Card>

      {tareaPorEliminar && (
        <Modal
          titulo="Confirmar eliminación"
          mensaje={`¿Estás seguro de que quieres eliminar "${tareaPorEliminar.title ?? tareaPorEliminar.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarTarea}
          onCancelar={() => {
            if (!guardando) setTareaPorEliminar(null)
          }}
        />
      )}
    </main>
  )
}

export default App