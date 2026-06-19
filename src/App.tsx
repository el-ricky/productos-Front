import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Producto {
  id: number
  nombre: string
  precio: number
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [cargando, setCargando] = useState(false)
  
  // Estados para edición
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  
  // Estados para buscador y paginación
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 5

  const API_URL = 'https://productos-api.productos-api.workers.dev/productos'

  // Cargar productos
  const cargarProductos = async () => {
    setCargando(true)
    try {
      const respuesta = await axios.get(API_URL)
      setProductos(respuesta.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      alert('Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }

  // Agregar producto
  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim() || !nuevoPrecio.trim()) {
      alert('Completa todos los campos')
      return
    }

    try {
      await axios.post(API_URL, {
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio)
      })
      setNuevoNombre('')
      setNuevoPrecio('')
      await cargarProductos()
      alert('Producto agregado ✅')
    } catch (error) {
      console.error('Error al agregar:', error)
      alert('Error al agregar producto')
    }
  }

  // Eliminar producto
  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await axios.delete(`${API_URL}/${id}`)
      await cargarProductos()
      alert('Producto eliminado ✅')
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar producto')
    }
  }

  // Iniciar edición
  const iniciarEdicion = (producto: Producto) => {
    setEditandoId(producto.id)
    setEditNombre(producto.nombre)
    setEditPrecio(producto.precio.toString())
  }

  // Guardar edición
  const guardarEdicion = async (id: number) => {
    if (!editNombre.trim() || !editPrecio.trim()) {
      alert('Completa todos los campos')
      return
    }

    try {
      await axios.put(`${API_URL}/${id}`, {
        nombre: editNombre,
        precio: parseFloat(editPrecio)
      })
      setEditandoId(null)
      await cargarProductos()
      alert('Producto actualizado ✅')
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('Error al actualizar producto')
    }
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditNombre('')
    setEditPrecio('')
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Calcular paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)
  const inicio = (paginaActual - 1) * productosPorPagina
  const fin = inicio + productosPorPagina
  const productosPaginados = productosFiltrados.slice(inicio, fin)

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>📦 Gestión de Productos</h1>

      {/* Formulario para agregar */}
      <form onSubmit={agregarProducto} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoPrecio}
          onChange={(e) => setNuevoPrecio(e.target.value)}
          style={{ width: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          step="0.01"
        />
        <button type="submit" style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Agregar
        </button>
      </form>

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', fontSize: '16px' }}
      />

      {/* Tabla de productos */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay productos</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Producto</th>
                <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Precio</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.map((producto) => (
                <tr key={producto.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{producto.id}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {editandoId === producto.id ? (
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        style={{ width: '100%', padding: '5px', border: '1px solid #007bff', borderRadius: '4px' }}
                      />
                    ) : (
                      producto.nombre
                    )}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                    {editandoId === producto.id ? (
                      <input
                        type="number"
                        value={editPrecio}
                        onChange={(e) => setEditPrecio(e.target.value)}
                        style={{ width: '80px', padding: '5px', border: '1px solid #007bff', borderRadius: '4px', textAlign: 'right' }}
                        step="0.01"
                      />
                    ) : (
                      `$${producto.precio.toFixed(2)}`
                    )}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {editandoId === producto.id ? (
                      <>
                        <button
                          onClick={() => guardarEdicion(producto.id)}
                          style={{ padding: '5px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                        >
                          💾 Guardar
                        </button>
                        <button
                          onClick={cancelarEdicion}
                          style={{ padding: '5px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          ❌ Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => iniciarEdicion(producto)}
                          style={{ padding: '5px 12px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          style={{ padding: '5px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          🗑️ Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: paginaActual === 1 ? '#f0f0f0' : 'white' }}
              >
                ◀ Anterior
              </button>
              <span style={{ padding: '8px 16px' }}>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: paginaActual === totalPaginas ? '#f0f0f0' : 'white' }}
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App