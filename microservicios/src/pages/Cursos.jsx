import React, { useEffect, useState } from "react";
import "../styles/global.css";

export default function Cursos() {
  const baseUrl = "http://localhost:9090/Curso";

  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({ id: "", nombre: "", docente: "" });

  const fetchCursos = async () => {
    const res = await fetch(`${baseUrl}/all`);
    const data = await res.json();
    setCursos(data);
  };

  useEffect(() => { fetchCursos(); }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, nombre, docente } = formData;

    // === ENDPOINTS ADAPTADOS A TU SERVICIO NESTJS ===
    const url = id 
      ? `${baseUrl}/update/${id}`
      : `${baseUrl}/create`;

    const method = id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, docente }),
    });

    setFormData({ id: "", nombre: "", docente: "" });
    fetchCursos();
  };

  const handleEdit = (curso) => setFormData({ ...curso });

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este curso?")) return;

    await fetch(`${baseUrl}/delete/${id}`, { method: "DELETE" });
    setCursos(cursos.filter(c => c.id !== id));
  };

  return (
    <section className="page">
      <h2>Cursos Disponibles</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="docente"
          placeholder="Docente"
          value={formData.docente}
          onChange={handleChange}
          required
        />

        <button type="submit" className="save">
          {formData.id ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Docente</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td>{curso.nombre}</td>
              <td>{curso.docente}</td>

              <td>
                <button className="edit" onClick={() => handleEdit(curso)}>Editar</button>
                <button className="delete" onClick={() => handleDelete(curso.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
