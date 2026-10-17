import { useState, useEffect } from 'react'
import { obtenerTareas } from '../services/tareasService'

const CLAVE_TAREAS = 'taskcampus-tareas'

export function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Cargar tareas al iniciar la aplicación
  useEffect(() => {
    async function cargarTareas() {
      try {
        setCargando(true)
        setError('')

        const guardadas = localStorage.getItem(CLAVE_TAREAS)

        if (guardadas !== null) {
          const tareasGuardadas = JSON.parse(guardadas)

          if (Array.isArray(tareasGuardadas)) {
            setTareas(tareasGuardadas)
            return
          }
        }

        const datos = await obtenerTareas()

        const tareasIniciales = datos.map((tarea) => ({
          ...tarea,
          titulo: tarea.titulo ?? tarea.title ?? '',
          completada: tarea.completada ?? tarea.completed ?? false
        }))

        setTareas(tareasIniciales)
      } catch (err) {
        setError(
          err.message || 'Ocurrió un error al cargar las tareas'
        )
      } finally {
        setCargando(false)
      }
    }

    cargarTareas()
  }, [])

  // Guardar automáticamente cuando cambian las tareas
  useEffect(() => {
    if (!cargando && !error) {
      localStorage.setItem(
        CLAVE_TAREAS,
        JSON.stringify(tareas)
      )
    }
  }, [tareas, cargando, error])

  function agregarTarea(titulo) {
    const nuevaTarea = {
      id: Date.now(),
      titulo: titulo.trim(),
      completada: false
    }

    setTareas((actuales) => [...actuales, nuevaTarea])
  }

  function cambiarEstado(id) {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    )
  }

  function eliminarTarea(id) {
    setTareas((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    )
  }

  function editarTarea(id, titulo) {
    if (!titulo.trim()) return

    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? { ...tarea, titulo: titulo.trim() }
          : tarea
      )
    )
  }

  return {
    tareas,
    cargando,
    error,
    agregarTarea,
    cambiarEstado,
    eliminarTarea,
    editarTarea
  }
}
