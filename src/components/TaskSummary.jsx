import { useState } from 'react'

function TaskSummary({ total, pendientes, completadas }) {
  const [contador, setContador] = useState(0)
  const [mostrarMensaje, setMostrarMensaje] = useState(false)

  return (
    <>
      <section className="resumen">
        <article className="tarjeta">
          <span>Total de tareas</span>
          <strong>{total}</strong>
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

      <section className="contador-prueba">
        <p>Contador de prueba: {contador}</p>

        <button
          type="button"
          onClick={() => setContador((valorActual) => valorActual + 1)}
        >
          Aumentar contador
        </button>

        <button
          type="button"
          onClick={() => setMostrarMensaje(!mostrarMensaje)}
        >
          Mostrar u ocultar mensaje
        </button>

        {mostrarMensaje && (
          <p>¡Sigue avanzando con TaskCampus!</p>
        )}
      </section>
    </>
  )
}

export default TaskSummary