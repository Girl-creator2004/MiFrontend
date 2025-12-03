// src/pages/Estudiantes.PruebaU.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Estudiantes from "./Estudiante"; // 👈 importante

describe("Componente Estudiantes", () => {
  beforeEach(() => {
    // mock de fetch y ventanas
    global.fetch = jest.fn();
    window.alert = jest.fn();
    window.confirm = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("carga y muestra estudiantes al iniciar", async () => {
    // simulamos la respuesta del backend
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          nombre: "Juan",
          apellidoP: "Pérez",
          apellidoM: "López",
          cursoId: 10,
        },
      ],
    });

    render(<Estudiantes />);

    // espera a que aparezca el estudiante en la tabla
    expect(await screen.findByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Pérez")).toBeInTheDocument();
    expect(screen.getByText("López")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("guarda un nuevo estudiante (POST) al enviar el formulario", async () => {
    // 1er fetch: carga inicial (vacía)
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // 2do fetch: POST /students
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      })
      // 3er fetch: recarga lista
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            nombre: "Ana",
            apellidoP: "García",
            apellidoM: "Ruiz",
            cursoId: 5,
          },
        ],
      });

    render(<Estudiantes />);

    // llenar formulario
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { id: "nombre", value: "Ana" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido Paterno"), {
      target: { id: "apellidoP", value: "García" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido Materno"), {
      target: { id: "apellidoM", value: "Ruiz" },
    });
    fireEvent.change(screen.getByPlaceholderText("ID del Curso"), {
      target: { id: "cursoId", value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8090/api/students",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: "Ana",
            apellidoP: "García",
            apellidoM: "Ruiz",
            cursoId: 5,
          }),
        })
      );
    });

    // comprobamos que la nueva alumna aparece en la tabla
    expect(await screen.findByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("García")).toBeInTheDocument();
    expect(screen.getByText("Ruiz")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
