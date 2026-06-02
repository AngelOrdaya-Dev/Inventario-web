import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, ChevronDown, Check, AlertCircle } from 'lucide-react';

export default function ModuloProductos({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Bebidas',
    price: '',
    stock: '',
    minStock: ''
  });

  const categories = ['Todas', 'Bebidas', 'Lácteos', 'Abarrotes', 'Limpieza', 'Cuidado Personal', 'Golosinas'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', sku: `COR-${Math.floor(1000 + Math.random() * 9000)}`, category: 'Bebidas', price: '', stock: '', minStock: '' });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock || 5
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    const minStockNum = parseInt(formData.minStock);

    if (modalMode === 'add') {
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: priceNum,
        stock: stockNum,
        minStock: minStockNum
      };
      setProducts([...products, newProduct]);
    } else {
      const updated = products.map(p => p.id === selectedProduct.id ? {
        ...p,
        name: formData.name,
        category: formData.category,
        price: priceNum,
        stock: stockNum,
        minStock: minStockNum
      } : p);
      setProducts(updated);
    }
    setShowModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-primary">GESTIÓN</span>
          <h2 className="module-title">Catálogo de Productos</h2>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="filters-bar glass-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Categoría:</label>
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
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= (product.minStock || 5);
              return (
                <tr key={product.id}>
                  <td className="font-mono text-cyan">{product.sku}</td>
                  <td><span className="font-semibold">{product.name}</span></td>
                  <td><span className="badge badge-dark">{product.category}</span></td>
                  <td className="font-semibold">${product.price.toFixed(2)}</td>
                  <td>
                    <span className={isLowStock ? 'text-red font-semibold' : 'text-green font-semibold'}>
                      {product.stock} unds
                    </span>
                  </td>
                  <td>
                    {isLowStock ? (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={12} /> Stock Crítico
                      </span>
                    ) : (
                      <span className="badge badge-success">Disponible</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" onClick={() => openEditModal(product)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-action delete" onClick={() => handleDelete(product.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No se encontraron productos que coincidan con la búsqueda.
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    disabled
                    className="form-input"
                    value={formData.sku}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-4">
                  <label className="form-label">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Stock Inicial</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Stock Mínimo</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
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
    </div>
  );
}
