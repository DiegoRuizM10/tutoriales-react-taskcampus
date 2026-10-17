
import { useState, useEffect } from 'react'
import { obtenerTareas } from '../services/tareasService'

export function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarTareas() {
      try {
        setCargando(true)
        setError('')

        const datos = await obtenerTareas()
        setTareas(datos)
      } catch (err) {
        setError(err.message || 'Ocurrió un error al cargar las tareas')
      } finally {
        setCargando(false)
      }
    }

    cargarTareas()
  }, [])

  function agregarTarea(titulo) {
    const nuevaTarea = {
      id: Date.now(),
      titulo: titulo.trim(),
      completada: false,
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
    editarTarea,
  }
}
