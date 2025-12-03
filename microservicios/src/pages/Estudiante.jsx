import React, { useEffect, useState } from "react";
import "../styles/global.css";

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    cursoId: "",
  });

  //Cargar estudiantes al iniciar
  const fetchEstudiantes = async () => {
    try {
      const res = await fetch("http://localhost:8090/api/students/all");
      const data = await res.json();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  //Actualiza los campos del formulario
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  //Guardar o actualizar estudiante
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, nombre, apellidoP, apellidoM, cursoId } = formData;

    const data = {
      nombre,
      apellidoP,
      apellidoM,
      cursoId: parseInt(cursoId),
    };

    let url = "http://localhost:8090/api/students";
    let method = "POST";

    if (id) {
      //Si tiene id se actualiza
      url = `http://localhost:8090/api/students/${id}`;
      method = "PATCH";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Error al guardar/actualizar:", await response.text());
        alert("Error al guardar o actualizar el estudiante");
        return;
      }

      setFormData({ id: "", nombre: "", apellidoP: "", apellidoM: "", cursoId: "" });
      await fetchEstudiantes();
      alert(id ? "Estudiante actualizado" : "✅ Estudiante agregado");
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  //Cargar datos al presionar “Editar”
  const handleEdit = (est) => {
    setFormData({
      id: est.id,
      nombre: est.nombre || "",
      apellidoP: est.apellidoP || "",
      apellidoM: est.apellidoM || "",
      cursoId: est.cursoId || "",
    });
  };

  // Eliminar estudiante
  const handleDelete = async (id) => {
    if (!window.confirm("Desea eliminar a este estudiante?")) return;
    try {
      await fetch(`http://localhost:8090/api/students/${id}`, { method: "DELETE" });
      setEstudiantes(estudiantes.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <section className="page">
      <h2>🎓 Lista de Estudiantes</h2>

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
          id="apellidoP"
          placeholder="Apellido Paterno"
          value={formData.apellidoP}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          id="apellidoM"
          placeholder="Apellido Materno"
          value={formData.apellidoM}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          id="cursoId"
          placeholder="ID del Curso"
          value={formData.cursoId}
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
            <th>Apellido P</th>
            <th>Apellido M</th>
            <th>Curso ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.apellidoP}</td>
              <td>{e.apellidoM}</td>
              <td>{e.cursoId}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(e)}>
                  Editar
                </button>
                <button className="delete" onClick={() => handleDelete(e.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
