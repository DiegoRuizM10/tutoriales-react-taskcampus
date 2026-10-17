
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

async function comprobarRespuesta(respuesta) {
  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`)
  }

  if (respuesta.status === 204) {
    return null
  }

  return respuesta.json()
}

export async function obtenerTareas() {
  const respuesta = await fetch(`${API_URL}?_limit=10`)
  return comprobarRespuesta(respuesta)
}

export async function crearTarea(titulo) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: titulo,
      completed: false,
      userId: 1
    })
  })

  return comprobarRespuesta(respuesta)
}

export async function actualizarTarea(id, cambios) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cambios)
  })

  return comprobarRespuesta(respuesta)
}

export async function eliminarTareaAPI(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  return comprobarRespuesta(respuesta)
}
