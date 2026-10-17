const API_URL = 'https://jsonplaceholder.typicode.com/todos'

export async function obtenerTareas() {
  const respuesta = await fetch(`${API_URL}?_limit=10`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las tareas')
  }

  const datos = await respuesta.json()

  return datos.map((tarea) => ({
    id: tarea.id,
    titulo: tarea.title,
    completada: tarea.completed,
  }))
}
