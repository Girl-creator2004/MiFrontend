import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cursos from "./pages/Cursos";
import Estudiantes from "./pages/Estudiante";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <nav className="navbar">
        <Link to="/">Inicio</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/estudiantes">Estudiantes</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
