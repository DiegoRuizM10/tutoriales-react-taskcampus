
function Modal({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancelar}
    >
      <section
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="modal-titulo">{titulo}</h2>

        <p>{mensaje}</p>

        <div className="modal-acciones">
          <button
            type="button"
            className="boton-cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="boton-eliminar"
            onClick={onConfirmar}
          >
            Sí, eliminar
          </button>
        </div>
      </section>
    </div>
  )
}

export default Modal
