import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function ModuloProductos({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [unidad, setUnidad] = useState('Unidad/Pieza');
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  // Handle modal open for create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setCodigo('');
    setProducto('');
    setCategoria('');
    setPrecio('');
    setUnidad('Unidad/Pieza');
    setStock('');
    setStockMinimo('');
    setDescripcion('');
    setError('');
    setIsModalOpen(true);
  };

  // Handle modal open for edit
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setCodigo(p.codigo);
    setProducto(p.producto);
    setCategoria(p.categoria);
    setPrecio(p.precio);
    setUnidad(p.unidad);
    setStock(p.stock);
    setStockMinimo(p.stockMinimo);
    setDescripcion(p.descripcion || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!codigo || !producto || !precio || !stock || !stockMinimo) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    const payload = {
      codigo,
      producto,
      categoria: categoria || 'General',
      precio: Number(precio),
      unidad,
      stock: Number(stock),
      stockMinimo: Number(stockMinimo),
      descripcion
    };

    if (editingProduct) {
      onEditProduct(payload);
    } else {
      // Check duplicate code
      if (products.some(p => p.codigo === codigo)) {
        setError('Ya existe un producto registrado con este código de barras.');
        return;
      }
      onAddProduct(payload);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.includes(searchTerm)
  );

  return (
    <div className="module-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Inventario de Productos</span>
          <h1 className="gradient-text">Productos</h1>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Registrar nuevo producto
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card table-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card table-wrapper-card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Código de Barras</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Unidad</th>
                <th>Stock</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No se encontraron productos en el inventario.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isCritical = Number(p.stock) <= Number(p.stockMinimo);
                  return (
                    <tr key={p.codigo}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{p.codigo}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'white' }}>{p.producto}</div>
                        {p.descripcion && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.descripcion}</div>}
                      </td>
                      <td>
                        <span className="badge badge-info">{p.categoria}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>S/ {Number(p.precio).toFixed(2)}</td>
                      <td>{p.unidad}</td>
                      <td>
                        <span className={`badge ${isCritical ? 'badge-danger' : 'badge-success'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-action-edit" onClick={() => handleOpenEdit(p)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-action-delete" onClick={() => onDeleteProduct(p.codigo)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>
              {editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}
            </h2>

            {error && (
              <div className="login-error-badge" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-form-grid">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Arroz costeño 1kg"
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Código de Barras *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. 7751234567890"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    disabled={!!editingProduct}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unidad de Medida *</label>
                  <select
                    className="form-input"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                  >
                    <option value="Unidad/Pieza">Unidad/Pieza</option>
                    <option value="paquetes">Paquetes</option>
                    <option value="bolsas">Bolsas</option>
                    <option value="cajas">Cajas</option>
                    <option value="kilogramos">Kilogramos</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Stock Inicial *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Mínimo *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Abarrotes, Bebidas..."
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  placeholder="Descripción del producto (opcional)..."
                  rows="3"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .module-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .table-controls {
          padding: 1.25rem !important;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 450px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-box .form-input {
          padding-left: 2.75rem;
        }

        .table-wrapper-card {
          padding: 0 !important;
          overflow: hidden;
        }

        .btn-action-edit, .btn-action-delete {
          padding: 0.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-action-edit {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .btn-action-edit:hover {
          background: #38bdf8;
          color: white;
        }

        .btn-action-delete {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .btn-action-delete:hover {
          background: #ef4444;
          color: white;
        }

        .modal-close {
          position: absolute;
          right: 1.5rem;
          top: 1.5rem;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .modal-close:hover {
          color: white;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
