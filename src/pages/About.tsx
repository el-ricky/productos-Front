import React from 'react'
import './About.css'

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">Acerca de</h1>
        
        <div className="about-content">
          <p>
            <strong>Gestión de Productos</strong> es una aplicación web desarrollada 
            como parte de un proyecto de estadía.
          </p>
          
          <h2>Tecnologías utilizadas</h2>
          <ul className="about-tech-list">
            <li><span className="tech-badge">React</span> - Frontend</li>
            <li><span className="tech-badge">TypeScript</span> - Tipado seguro</li>
            <li><span className="tech-badge">Cloudflare Workers</span> - Backend API</li>
            <li><span className="tech-badge">Cloudflare D1</span> - Base de datos</li>
            <li><span className="tech-badge">Hono</span> - Framework para API</li>
            <li><span className="tech-badge">Drizzle ORM</span> - Manejo de base de datos</li>
          </ul>

          <h2>Funcionalidades</h2>
          <ul className="about-features">
            <li>✅ Agregar productos</li>
            <li>✅ Editar productos</li>
            <li>✅ Eliminar productos</li>
            <li>✅ Buscador en tiempo real</li>
            <li>✅ Paginación</li>
          </ul>

          <div className="about-footer">
            <p className="about-version">Versión 1.0.0</p>
            <p className="about-date">Proyecto de Estadía - 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About