import React, { useState } from 'react';
import { Package, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ModuloInventario({ products, onQuickReplenish }) {
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Movement History
  const [movements, setMovements] = useState([
    { id: 1, codigo: '001381450', name: 'Arroz Costeño 1kg', type: 'Entrada', quantity: 50, date: '2026-06-01', user: 'Giancarlos B.' },
    { id: 2, codigo: '001201240', name: 'Atún Real en aceite', type: 'Salida (Venta)', quantity: 12, date: '2026-06-01', user: 'Colaborador Corvex' },
    { id: 3, codigo: '0012578956', name: 'Fideos Don Vittorio', type: 'Entrada', quantity: 24, date: '2026-05-31', user: 'Giancarlos B.' },
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
    const newStock = adjustType === 'Entrada'
      ? selectedProduct.stock + qty
      : Math.max(0, selectedProduct.stock - qty);

    // Update via parent handler
    onQuickReplenish(selectedProduct.codigo, newStock);

    // Register movement log
    const newMovement = {
      id: Date.now(),
      codigo: selectedProduct.codigo,
      name: selectedProduct.producto,
      type: adjustType === 'Entrada' ? 'Entrada (Ajuste)' : 'Salida (Ajuste)',
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      user: 'Admin'
    };

    setMovements([newMovement, ...movements]);
    setShowAdjustModal(false);
  };

  // Stock valuation using correct field names
  const totalValue = products.reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.stock || 0)), 0);
  const lowStockCount = products.filter(p => Number(p.stock) <= Number(p.stockMinimo || 5)).length;

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-danger">KARDEX</span>
          <h2 className="module-title">Inventario y Movimientos</h2>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '0.5rem' }}>
        <div className="stat-card glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="stat-label">Stock Valorizado Total</span>
              <h3 className="stat-value" style={{ color: '#10b981' }}>
                S/ {totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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
                {lowStockCount}
              </h3>
            </div>
            <div className="stat-icon-wrapper danger">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Stock Table */}
        <div className="glass-card table-responsive">
          <div style={{ padding: '1.5rem 1.5rem 0' }}>
            <h3 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '1rem' }}>Ajuste Rápido de Stock</h3>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.codigo}>
                  <td className="font-mono text-cyan">{p.codigo}</td>
                  <td className="font-semibold">{p.producto}</td>
                  <td>
                    <span className={Number(p.stock) <= Number(p.stockMinimo || 5) ? 'text-red font-semibold' : 'text-green font-semibold'}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', gap: '0.35rem' }}
                      onClick={() => openAdjustModal(p)}
                    >
                      <RefreshCw size={13} />
                      Ajustar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Movements Log */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '1rem' }}>Historial de Movimientos</h3>
          <div className="movement-log-list">
            {movements.map((m) => {
              const isEntrada = m.type.includes('Entrada');
              return (
                <div key={m.id} className="movement-log-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`movement-icon ${isEntrada ? 'in' : 'out'}`}>
                      {isEntrada ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: 'white', fontSize: '0.875rem' }}>{m.name}</span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {m.codigo} | {m.user} | {m.date}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`font-semibold ${isEntrada ? 'text-green' : 'text-red'}`} style={{ fontSize: '1rem' }}>
                      {isEntrada ? '+' : '-'}{m.quantity}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Adjust Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <h3>Ajustar Inventario</h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Producto: <strong style={{ color: 'white' }}>{selectedProduct.producto}</strong>
              &nbsp;— Stock actual: <strong style={{ color: '#38bdf8' }}>{selectedProduct.stock} {selectedProduct.unidad}</strong>
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
                    ↑ Entrada (Ingreso)
                  </button>
                  <button
                    type="button"
                    className={`btn-select ${adjustType === 'Salida' ? 'active' : ''}`}
                    onClick={() => { setAdjustType('Salida'); setReason('Merma / Daño'); }}
                    style={{ flex: 1 }}
                  >
                    ↓ Salida (Egreso)
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
                    placeholder="Ej: 10"
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
          gap: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .movement-log-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0.875rem;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .movement-log-item:hover {
          background: rgba(255,255,255,0.025);
          border-color: rgba(255,255,255,0.08);
        }
        .movement-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .movement-icon.in {
          background: rgba(16,185,129,0.12);
          color: #10b981;
        }
        .movement-icon.out {
          background: rgba(239,68,68,0.12);
          color: #ef4444;
        }
        .btn-select {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          padding: 0.7rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-select.active {
          background: #38bdf8;
          color: #070a13;
          border-color: #38bdf8;
          box-shadow: 0 0 14px rgba(56,189,248,0.3);
        }
        .btn-select:hover:not(.active) {
          background: rgba(255,255,255,0.05);
          color: white;
        }
      `}</style>
    </div>
  );
}
