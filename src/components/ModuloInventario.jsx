import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Edit3, X } from 'lucide-react';

export default function ModuloInventario({ products, onQuickReplenish }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' or 'low'
  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');

  // Total items in stock
  const totalUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.producto.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.includes(searchTerm);
    const isCritical = Number(p.stock) <= Number(p.stockMinimo);
    
    if (filterType === 'low') {
      return matchesSearch && isCritical;
    }
    return matchesSearch;
  });

  const handleOpenReplenish = (p) => {
    setEditingStockProduct(p);
    setNewStockVal(p.stock);
  };

  const handleSaveReplenish = (e) => {
    e.preventDefault();
    if (editingStockProduct && newStockVal !== '') {
      onQuickReplenish(editingStockProduct.codigo, Number(newStockVal));
      setEditingStockProduct(null);
    }
  };

  return (
    <div className="module-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Monitoreo de Stock en Tiempo Real</span>
          <h1 className="gradient-text">Gestión de Inventario</h1>
        </div>
        
        {/* Metric summary widget */}
        <div className="total-units-badge glass-card">
          <span className="units-label">TOTAL UNIDADES</span>
          <span className="units-value">{totalUnits}</span>
        </div>
      </div>

      {/* Tabs and Search Filters */}
      <div className="glass-card controls-bar">
        <div className="tabs-group">
          <button 
            className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Todos los productos
          </button>
          <button 
            className={`tab-btn ${filterType === 'low' ? 'active' : ''}`}
            onClick={() => setFilterType('low')}
          >
            Stock bajo
            {products.some(p => Number(p.stock) <= Number(p.stockMinimo)) && (
              <span className="tab-alert-dot"></span>
            )}
          </button>
        </div>

        <div className="search-box" style={{ maxWidth: '350px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar en almacén..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stock Health Grid / Table */}
      <div className="glass-card table-wrapper-card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Almacén</th>
                <th>Mínimo</th>
                <th>Stock Actual</th>
                <th>Nivel de Stock</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {filterType === 'low' ? '¡Excelente! No hay productos con stock bajo.' : 'No se encontraron productos.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isCritical = Number(p.stock) <= Number(p.stockMinimo);
                  // Percent calculation for visual bar
                  const maxDisplayStock = Math.max(Number(p.stockMinimo) * 2, Number(p.stock));
                  const percentage = Math.min(Math.round((Number(p.stock) / (maxDisplayStock || 1)) * 100), 100);

                  return (
                    <tr key={p.codigo}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'white' }}>{p.producto}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Código: {p.codigo}</div>
                      </td>
                      <td>
                        <span className="warehouse-badge">Principal</span>
                      </td>
                      <td>{p.stockMinimo} {p.unidad}</td>
                      <td style={{ fontWeight: 700, color: isCritical ? '#ef4444' : '#10b981' }}>
                        {p.stock} {p.unidad}
                      </td>
                      <td style={{ width: '220px' }}>
                        <div className="gauge-container">
                          <div className="gauge-bg">
                            <div 
                              className={`gauge-fill ${isCritical ? 'critical' : 'optimal'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="gauge-lbl">{percentage}%</span>
                        </div>
                      </td>
                      <td>
                        {isCritical ? (
                          <span className="badge badge-danger" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                            <AlertTriangle size={12} /> Stock Bajo
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                            <ShieldCheck size={12} /> Normal
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-action-edit" onClick={() => handleOpenReplenish(p)} title="Abastecer Stock">
                          <Edit3 size={16} />
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

      {/* Quick Replenish Modal */}
      {editingStockProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setEditingStockProduct(null)}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.25rem', color: 'white' }}>Abastecer Stock</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Modifique directamente el nivel de inventario actual de <strong>{editingStockProduct.producto}</strong> en el Almacén Principal.
            </p>

            <form onSubmit={handleSaveReplenish}>
              <div className="form-group">
                <label className="form-label">Stock Actual ({editingStockProduct.unidad})</label>
                <input
                  type="number"
                  className="form-input"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingStockProduct(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .total-units-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.6rem 1.25rem !important;
          border-radius: 12px !important;
          background: rgba(14, 165, 233, 0.08) !important;
          border-color: rgba(14, 165, 233, 0.2) !important;
        }

        .units-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.1em;
        }

        .units-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #38bdf8;
          font-family: 'Outfit', sans-serif;
        }

        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem !important;
          flex-wrap: wrap;
        }

        .tabs-group {
          display: flex;
          background: rgba(31, 41, 55, 0.4);
          padding: 0.3rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .tab-btn {
          background: none;
          border: none;
          color: #94a3b8;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          position: relative;
        }

        .tab-btn.active {
          background: var(--bg-tertiary);
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .tab-alert-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
        }

        .warehouse-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: #cbd5e1;
        }

        .gauge-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
        }

        .gauge-bg {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
          overflow: hidden;
        }

        .gauge-fill {
          height: 100%;
          border-radius: 999px;
        }

        .gauge-fill.critical {
          background: linear-gradient(90deg, #f87171, #ef4444);
        }

        .gauge-fill.optimal {
          background: linear-gradient(90deg, #34d399, #10b981);
        }

        .gauge-lbl {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          min-width: 32px;
        }
      `}</style>
    </div>
  );
}
