
import { useState, useEffect } from 'react'
import {
  obtenerTareas,
  crearTarea as crearTareaAPI,
  actualizarTarea as actualizarTareaAPI,
  eliminarTareaAPI
} from '../services/tareasService'

export function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargar() {
      try {
        setCargando(true)
        setError(null)

        const datos = await obtenerTareas()
        setTareas(datos)
      } catch (err) {
        if (!controlador.signal.aborted) {
          setError(err.message || 'No se pudieron cargar las tareas.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargar()

    return () => controlador.abort()
  }, [])

  async function agregarTarea(titulo) {
    const tituloLimpio = String(titulo ?? '').trim()

    if (!tituloLimpio) {
      setError('El título no puede estar vacío.')
      return false
    }

    try {
      setGuardando(true)
      setError(null)

      const nuevaTarea = await crearTareaAPI(tituloLimpio)

      setTareas((anteriores) => [
        { ...nuevaTarea, id: Date.now() },
        ...anteriores
      ])

      return true
    } catch (err) {
      setError(err.message || 'No se pudo crear la tarea.')
      return false
    } finally {
      setGuardando(false)
    }
  }

  async function cambiarEstado(id) {
    const tarea = tareas.find((item) => item.id === id)

    if (!tarea) return false

    const estadoActual = tarea.completed ?? tarea.completada ?? false

    try {
      setGuardando(true)
      setError(null)

      await actualizarTareaAPI(id, {
        completed: !estadoActual
      })

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === id
            ? { ...item, completed: !estadoActual }
            : item
        )
      )

      return true
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado.')
      return false
    } finally {
      setGuardando(false)
    }
  }

  async function editarTarea(id, nuevoTitulo) {
    const tituloLimpio = String(nuevoTitulo ?? '').trim()

    if (!tituloLimpio) {
      setError('El título no puede estar vacío.')
      return false
    }

    try {
      setGuardando(true)
      setError(null)

      await actualizarTareaAPI(id, {
        title: tituloLimpio
      })

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === id
            ? { ...item, title: tituloLimpio }
            : item
        )
      )

      return true
    } catch (err) {
      setError(err.message || 'No se pudo editar la tarea.')
      return false
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarTarea(id) {
    try {
      setGuardando(true)
      setError(null)

      await eliminarTareaAPI(id)

      setTareas((anteriores) =>
        anteriores.filter((item) => item.id !== id)
      )

      return true
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la tarea.')
      return false
    } finally {
      setGuardando(false)
    }
  }

  return {
    tareas,
    cargando,
    guardando,
    operacionEnCurso: guardando,
    error,
    agregarTarea,
    cambiarEstado,
    editarTarea,
    eliminarTarea
  }
}
