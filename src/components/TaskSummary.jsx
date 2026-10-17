function TaskSummary({ total, pendientes, completadas }) {
  return (
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
  )
}

export default TaskSummary
