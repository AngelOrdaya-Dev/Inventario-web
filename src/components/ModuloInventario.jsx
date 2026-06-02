import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, ArrowRightLeft, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ModuloInventario({ products, setProducts }) {
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Movement History Simulation
  const [movements, setMovements] = useState([
    { id: 1, sku: 'COR-8374', name: 'Leche Gloria 1L', type: 'Entrada', quantity: 50, date: '2026-06-01', user: 'Giancarlos B.' },
    { id: 2, sku: 'COR-2947', name: 'Coca Cola 1.5L', type: 'Salida (Venta)', quantity: 12, date: '2026-06-01', user: 'Colaborador Corvex' },
    { id: 3, sku: 'COR-4819', name: 'Jabón Bolívar Bebé', type: 'Entrada', quantity: 24, date: '2026-05-31', user: 'Giancarlos B.' },
  ]);

  // Adjust Form State
  const [adjustType, setAdjustType] = useState('Entrada');
  const [adjustQty, setAdjustQty] = useState('');
  const [reason, setReason] = useState('Reabastecimiento');

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustQty('');
    setAdjustType('Entrada');
    setReason('Reabastecimiento');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = parseInt(adjustQty);
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const newStock = adjustType === 'Entrada' ? p.stock + qty : Math.max(0, p.stock - qty);
        return { ...p, stock: newStock };
      }
      return p;
    });

    setProducts(updatedProducts);

    // Register movement log
    const newMovement = {
      id: Date.now(),
      sku: selectedProduct.sku,
      name: selectedProduct.name,
      type: adjustType === 'Entrada' ? 'Entrada (Ajuste)' : 'Salida (Ajuste)',
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      user: 'Giancarlos B. (Admin)'
    };

    setMovements([newMovement, ...movements]);
    setShowAdjustModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-danger">KARDEX</span>
          <h2 className="module-title">Inventarios y Movimientos</h2>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="stat-label">Stock Valorizado Total</span>
              <h3 className="stat-value" style={{ color: '#10b981' }}>
                ${products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="stat-icon-wrapper success">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="stat-label">Alertas de Reposición</span>
              <h3 className="stat-value" style={{ color: '#ef4444' }}>
                {products.filter(p => p.stock <= (p.minStock || 5)).length}
              </h3>
            </div>
            <div className="stat-icon-wrapper danger">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Stock Adjustment Controls */}
        <div className="glass-card table-responsive" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', marginBottom: '1.25rem' }}>Ajuste de Stock Rápido</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-cyan">{p.sku}</td>
                  <td className="font-semibold">{p.name}</td>
                  <td>
                    <span className={p.stock <= (p.minStock || 5) ? 'text-red font-semibold' : 'text-green font-semibold'}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => openAdjustModal(p)}>
                      <RefreshCw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Ajustar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side: Movements Log */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', marginBottom: '1.25rem' }}>Historial de Movimientos</h3>
          <div className="movement-log-list">
            {movements.map((m) => {
              const isEntrada = m.type.includes('Entrada');
              return (
                <div key={m.id} className="movement-log-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`movement-icon ${isEntrada ? 'in' : 'out'}`}>
                      {isEntrada ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{m.name}</span>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        SKU: {m.sku} | {m.user} | {m.date}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`font-semibold ${isEntrada ? 'text-green' : 'text-red'}`} style={{ fontSize: '1.1rem' }}>
                      {isEntrada ? '+' : '-'}{m.quantity}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAdjustModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animated zoomIn" style={{ maxWidth: '450px' }}>
            <h3>Ajustar Inventario</h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
              Producto seleccionado: <strong className="text-white">{selectedProduct.name}</strong>
            </p>

            <form onSubmit={handleAdjustSubmit}>
              <div className="form-group">
                <label className="form-label">Tipo de Movimiento</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    className={`btn-select ${adjustType === 'Entrada' ? 'active' : ''}`}
                    onClick={() => { setAdjustType('Entrada'); setReason('Reabastecimiento'); }}
                    style={{ flex: 1 }}
                  >
                    Entrada (Ingreso)
                  </button>
                  <button
                    type="button"
                    className={`btn-select ${adjustType === 'Salida' ? 'active' : ''}`}
                    onClick={() => { setAdjustType('Salida'); setReason('Merma / Daño'); }}
                    style={{ flex: 1 }}
                  >
                    Salida (Egreso)
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Motivo</label>
                  <select
                    className="form-input"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    {adjustType === 'Entrada' ? (
                      <>
                        <option value="Reabastecimiento">Reabastecimiento</option>
                        <option value="Devolución de cliente">Devolución de cliente</option>
                        <option value="Inventario Físico">Inventario Físico</option>
                      </>
                    ) : (
                      <>
                        <option value="Merma / Daño">Merma / Daño</option>
                        <option value="Robo o Pérdida">Robo o Pérdida</option>
                        <option value="Vencimiento">Vencimiento</option>
                        <option value="Inventario Físico">Inventario Físico</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAdjustModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Aplicar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .movement-log-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .movement-log-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .movement-log-item:hover {
          background: rgba(255,255,255,0.02);
          border-color: rgba(255,255,255,0.06);
        }
        .movement-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .movement-icon.in {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .movement-icon.out {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .btn-select {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .btn-select.active {
          background: #38bdf8;
          color: #070a13;
          border-color: #38bdf8;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
        }
      `}</style>
    </div>
  );
}
