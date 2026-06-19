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
  
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 5

  const API_URL = 'https://productos-api.productos-api.workers.dev/productos'

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

  const iniciarEdicion = (producto: Producto) => {
    setEditandoId(producto.id)
    setEditNombre(producto.nombre)
    setEditPrecio(producto.precio.toString())
  }

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

  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditNombre('')
    setEditPrecio('')
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)
  const inicio = (paginaActual - 1) * productosPorPagina
  const fin = inicio + productosPorPagina
  const productosPaginados = productosFiltrados.slice(inicio, fin)

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda])

  return (
    <div className="app-container">
      <h1 className="app-title">
        📦 <span>Gestión de Productos</span>
      </h1>

      <form className="form-container" onSubmit={agregarProducto}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoPrecio}
          onChange={(e) => setNuevoPrecio(e.target.value)}
          step="0.01"
        />
        <button type="submit" className="btn-add">
          Agregar
        </button>
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="table-container">
        <div className="table-responsive">
          {cargando ? (
            <div className="empty-message">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="empty-message">No hay productos</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>
                      {editandoId === producto.id ? (
                        <input
                          type="text"
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                        />
                      ) : (
                        producto.nombre
                      )}
                    </td>
                    <td>
                      {editandoId === producto.id ? (
                        <input
                          type="number"
                          value={editPrecio}
                          onChange={(e) => setEditPrecio(e.target.value)}
                          step="0.01"
                        />
                      ) : (
                        `$${producto.precio.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        {editandoId === producto.id ? (
                          <>
                            <button className="btn-save" onClick={() => guardarEdicion(producto.id)}>
                              💾 Guardar
                            </button>
                            <button className="btn-cancel" onClick={cancelarEdicion}>
                              ❌ Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn-edit" onClick={() => iniciarEdicion(producto)}>
                              ✏️ Editar
                            </button>
                            <button className="btn-delete" onClick={() => eliminarProducto(producto.id)}>
                              🗑️ Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="pagination">
            <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
              ◀ Anterior
            </button>
            <span className="page-info">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
              Siguiente ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App