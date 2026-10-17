function Card({ titulo, children }) {
  return (
    <section className="panel">
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

export default Card