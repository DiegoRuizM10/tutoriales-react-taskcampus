
function Header({ usuario, onCambiarUsuario }) {
  return (
    <header className="encabezado">
      <div>
        <p className="etiqueta">
          ORGANIZACIÓN ACADÉMICA
        </p>

        <h1>TaskCampus</h1>

        <p className="subtitulo">
          Organiza tus tareas. Avanza a tu ritmo.
        </p>

        <p>Bienvenido, {usuario}</p>

        <button
          type="button"
          onClick={onCambiarUsuario}
        >
          Cambiar usuario
        </button>
      </div>
    </header>
  )
}

export default Header
