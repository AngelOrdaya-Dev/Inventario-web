import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionButton from './ActionButton';

export default function ModuloProductos({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    producto: '',
    codigo: '',
    categoria: 'General',
    precio: '',
    stock: '',
    stockMinimo: '',
    unidad: 'unidades',
    descripcion: ''
  });

  const categories = ['Todas', 'General', 'Abarrotes', 'Bebidas', 'LÃ¡cteos', 'Limpieza', 'Cuidado Personal', 'Golosinas'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.producto || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.codigo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || product.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      producto: '',
      codigo: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      categoria: 'General',
      precio: '',
      stock: '',
      stockMinimo: '',
      unidad: 'paquetes',
      descripcion: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      producto: product.producto,
      codigo: product.codigo,
      categoria: product.categoria || 'General',
      precio: product.precio,
      stock: product.stock,
      stockMinimo: product.stockMinimo || 5,
      unidad: product.unidad || 'unidades',
      descripcion: product.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = (codigo) => {
    if (confirm('Â¿EstÃ¡ seguro de eliminar este producto?')) {
      onDeleteProduct(codigo);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.precio);
    const stockNum = parseInt(formData.stock);
    const minStockNum = parseInt(formData.stockMinimo);

    const productPayload = {
      producto: formData.producto,
      codigo: formData.codigo,
      categoria: formData.categoria,
      precio: priceNum,
      stock: stockNum,
      stockMinimo: minStockNum,
      unidad: formData.unidad,
      descripcion: formData.descripcion
    };

    if (modalMode === 'add') {
      onAddProduct(productPayload);
    } else {
      onEditProduct(productPayload);
    }
    setShowModal(false);
  };

  return (
    <motion.div 
      className="module-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>INVENTARIO</span>
          <h2 className="module-title">Inventario de Productos</h2>
        </div>
        <motion.button 
          className="btn-primary" 
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: '#10b981', color: '#050505', border: 'none', fontWeight: 'bold' }}
        >
          <Plus size={18} /> Registrar nuevo producto
        </motion.button>
      </div>

      <div className="filters-bar glass-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o cÃ³digo de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>CategorÃ­a:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="select-input">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>CÃ³digo de Barras</th>
              <th>Producto</th>
              <th>CategorÃ­a</th>
              <th>Precio</th>
              <th>Unidad</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isLowStock = Number(product.stock) <= Number(product.stockMinimo || 5);
              return (
                <tr key={product.codigo}>
                  <td className="font-mono text-emerald">{product.codigo}</td>
                  <td>
                    <div>
                      <span className="font-semibold" style={{ color: 'white' }}>{product.producto}</span>
                      {product.descripcion && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product.descripcion}</div>
                      )}
                    </div>
                  </td>
                  <td><span className="badge badge-info">{product.categoria}</span></td>
                  <td className="font-semibold">S/ {product.precio.toFixed(2)}</td>
                  <td className="text-secondary">{product.unidad}</td>
                  <td>
                    <span className={isLowStock ? 'badge badge-danger' : 'badge badge-success'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex' }}>
                      <ActionButton type="edit" onClick={() => openEditModal(product)} title="Editar" />
                      <ActionButton type="delete" onClick={() => handleDelete(product.codigo)} title="Eliminar" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No se encontraron productos que coincidan con la bÃºsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animated zoomIn">
            <h3>{modalMode === 'add' ? 'Registrar Producto' : 'Editar Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">DescripciÃ³n</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">CÃ³digo de Barras</label>
                  <input
                    type="text"
                    disabled
                    className="form-input"
                    value={formData.codigo}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">CategorÃ­a</label>
                  <select
                    className="form-input"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-4">
                  <label className="form-label">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    className="form-input"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Unidad de Medida</label>
                  <input
                    type="text"
                    required
                    placeholder="paquetes, cajas, bolsas"
                    className="form-input"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Stock MÃ­nimo</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {modalMode === 'add' ? 'Registrar' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
