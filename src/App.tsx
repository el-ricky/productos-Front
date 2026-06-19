import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
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
      toast.error('Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }

  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim() || !nuevoPrecio.trim()) {
      toast.error('Nombre y precio son obligatorios')
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
      toast.success('Producto agregado correctamente')
    } catch (error) {
      console.error('Error al agregar:', error)
      toast.error('Error al agregar producto')
    }
  }

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await axios.delete(`${API_URL}/${id}`)
      await cargarProductos()
      toast.success('Producto eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar producto')
    }
  }

  const iniciarEdicion = (producto: Producto) => {
    setEditandoId(producto.id)
    setEditNombre(producto.nombre)
    setEditPrecio(producto.precio.toString())
  }

  const guardarEdicion = async (id: number) => {
    if (!editNombre.trim() || !editPrecio.trim()) {
      toast.error('Nombre y precio son obligatorios')
      return
    }

    try {
      await axios.put(`${API_URL}/${id}`, {
        nombre: editNombre,
        precio: parseFloat(editPrecio)
      })
      setEditandoId(null)
      await cargarProductos()
      toast.success('Producto actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar:', error)
      toast.error('Error al actualizar producto')
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
    <>
      <Navbar />
      <div className="app-container">
        <h1 className="app-title">Gestión de Productos</h1>

        <form className="form-container" onSubmit={agregarProducto}>
          <div className="form-row">
            <div className="field-group">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Laptop, Mouse, Teclado..."
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </div>
            <div className="field-group field-group--small">
              <label>Precio (MXN)</label>
              <input
                type="number"
                placeholder="0.00"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                step="0.01"
              />
            </div>
            <button type="submit" className="btn-add">
              Agregar producto
            </button>
          </div>
        </form>

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
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
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPaginados.map((producto) => (
                    <tr key={producto.id}>
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
                                Guardar
                              </button>
                              <button className="btn-cancel" onClick={cancelarEdicion}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn-edit" onClick={() => iniciarEdicion(producto)}>
                                Editar
                              </button>
                              <button className="btn-delete" onClick={() => eliminarProducto(producto.id)}>
                                Eliminar
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
    </>
  )
}

export default App