
import { useState, useEffect } from 'react'

const API_URL = 'https://jsonplaceholder.typicode.com/todos'

export function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [operacionEnCurso, setOperacionEnCurso] = useState(false)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarTareas() {
      try {
        setCargando(true)
        setError(null)

        const respuesta = await fetch(
          `${API_URL}?_limit=10`,
          { signal: controlador.signal }
        )

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las tareas.')
        }

        const datos = await respuesta.json()
        setTareas(datos)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar las tareas.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarTareas()

    return () => controlador.abort()
  }, [])

  async function agregarTarea(titulo) {
    const tituloLimpio = String(titulo ?? '').trim()

    if (!tituloLimpio) {
      setError('El título de la tarea no puede estar vacío.')
      return false
    }

    try {
      setOperacionEnCurso(true)
      setError(null)

      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: tituloLimpio,
          completed: false,
          userId: 1
        })
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo crear la tarea.')
      }

      const nuevaTarea = await respuesta.json()

      setTareas((anteriores) => [
        { ...nuevaTarea, id: Date.now() },
        ...anteriores
      ])

      return true
    } catch (err) {
      setError(err.message || 'Error al crear la tarea.')
      return false
    } finally {
      setOperacionEnCurso(false)
    }
  }

  async function cambiarEstado(id) {
    const tarea = tareas.find((item) => item.id === id)

    if (!tarea) return false

    const estadoActual = tarea.completed ?? tarea.completada ?? false

    try {
      setOperacionEnCurso(true)
      setError(null)

      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !estadoActual
        })
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo actualizar el estado.')
      }

      await respuesta.json()

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === id
            ? { ...item, completed: !estadoActual }
            : item
        )
      )

      return true
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado.')
      return false
    } finally {
      setOperacionEnCurso(false)
    }
  }

  async function editarTarea(id, nuevoTitulo) {
    const tituloLimpio = String(nuevoTitulo ?? '').trim()

    if (!tituloLimpio) {
      setError('El título no puede estar vacío.')
      return false
    }

    try {
      setOperacionEnCurso(true)
      setError(null)

      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: tituloLimpio
        })
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo editar la tarea.')
      }

      await respuesta.json()

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === id
            ? { ...item, title: tituloLimpio }
            : item
        )
      )

      return true
    } catch (err) {
      setError(err.message || 'Error al editar la tarea.')
      return false
    } finally {
      setOperacionEnCurso(false)
    }
  }

  async function eliminarTarea(id) {
    try {
      setOperacionEnCurso(true)
      setError(null)

      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la tarea.')
      }

      setTareas((anteriores) =>
        anteriores.filter((item) => item.id !== id)
      )

      return true
    } catch (err) {
      setError(err.message || 'Error al eliminar la tarea.')
      return false
    } finally {
      setOperacionEnCurso(false)
    }
  }

  return {
    tareas,
    cargando,
    error,
    operacionEnCurso,
    agregarTarea,
    cambiarEstado,
    editarTarea,
    eliminarTarea
  }
}
