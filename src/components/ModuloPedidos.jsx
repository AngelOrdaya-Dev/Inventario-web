import React, { useState } from 'react';
import { Plus, Trash2, X, AlertCircle, Eye, ShoppingBag } from 'lucide-react';

export default function ModuloPedidos({ orders, products, clients, onAddOrder, onUpdateOrderStatus, onDeleteOrder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // New Order State
  const [cliente, setCliente] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [notas, setNotas] = useState('');
  const [lineas, setLineas] = useState([{ codigo: '', cantidad: 1 }]);
  const [error, setError] = useState('');

  const handleOpenCreate = () => {
    setCliente(clients[0]?.nombre || '');
    setFechaEntrega(new Date().toISOString().split('T')[0]);
    setNotas('');
    setLineas([{ codigo: products[0]?.codigo || '', cantidad: 1 }]);
    setError('');
    setIsModalOpen(true);
  };

  const handleAddLinea = () => {
    setLineas([...lineas, { codigo: products[0]?.codigo || '', cantidad: 1 }]);
  };

  const handleRemoveLinea = (index) => {
    const newLines = lineas.filter((_, i) => i !== index);
    setLineas(newLines);
  };

  const handleLineaChange = (index, field, value) => {
    const newLines = [...lineas];
    newLines[index][field] = value;
    setLineas(newLines);
  };

  // Calculate dynamic estimated total
  const calculateTotal = () => {
    return lineas.reduce((sum, line) => {
      const p = products.find(prod => prod.codigo === line.codigo);
      return sum + (p ? Number(p.precio) * Number(line.cantidad) : 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!cliente || !fechaEntrega) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (lineas.some(l => !l.codigo || Number(l.cantidad) <= 0)) {
      setError('Asegúrese de agregar al menos un producto con cantidad válida.');
      return;
    }

    // Check stock availability
    for (const l of lineas) {
      const p = products.find(prod => prod.codigo === l.codigo);
      if (p && Number(p.stock) < Number(l.cantidad)) {
        setError(`Stock insuficiente para "${p.producto}". Stock actual: ${p.stock}`);
        return;
      }
    }

    const newOrder = {
      id: `#${String(orders.length + 1).padStart(3, '0')}`,
      cliente,
      fecha: new Date().toLocaleDateString('es-ES'),
      fechaEntrega,
      total: calculateTotal(),
      estado: 'Pendiente',
      notas,
      productos: lineas.map(l => {
        const p = products.find(prod => prod.codigo === l.codigo);
        return {
          codigo: l.codigo,
          nombre: p?.producto || '',
          cantidad: Number(l.cantidad),
          precio: p ? Number(p.precio) : 0
        };
      })
    };

    onAddOrder(newOrder);
    setIsModalOpen(false);
  };

  return (
    <div className="module-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Registro de Ventas y Envíos</span>
          <h1 className="gradient-text">Pedidos</h1>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Crear nuevo pedido
        </button>
      </div>

      {/* Orders List Table */}
      <div className="glass-card table-wrapper-card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Cliente</th>
                <th>Fecha de Registro</th>
                <th>Total Estimado</th>
                <th>Estado</th>
                <th>Fecha de Entrega</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No hay pedidos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{o.id}</td>
                    <td style={{ fontWeight: 600, color: 'white' }}>{o.cliente}</td>
                    <td>{o.fecha}</td>
                    <td style={{ fontWeight: 700 }}>S/ {Number(o.total).toFixed(2)}</td>
                    <td>
                      <select
                        className={`status-select ${
                          o.estado === 'Entregado' ? 'success' :
                          o.estado === 'Enviado' ? 'info' :
                          o.estado === 'Cancelado' ? 'danger' : 'warning'
                        }`}
                        value={o.estado}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-input-date-inline"
                        value={o.fechaEntrega}
                        disabled
                      />
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button className="btn-action-edit" onClick={() => setSelectedOrder(o)} title="Ver Detalle">
                        <Eye size={16} />
                      </button>
                      <button className="btn-action-delete" onClick={() => onDeleteOrder(o.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium View Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <ShoppingBag className="text-accent" size={24} />
              <h2 style={{ color: 'white' }}>Pedido {selectedOrder.id}</h2>
            </div>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Cliente</span>
                <span className="detail-val">{selectedOrder.cliente}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha Registro</span>
                <span className="detail-val">{selectedOrder.fecha}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de Entrega</span>
                <span className="detail-val">{selectedOrder.fechaEntrega}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado Actual</span>
                <span className="detail-val">
                  <span className={`badge ${
                    selectedOrder.estado === 'Entregado' ? 'badge-success' :
                    selectedOrder.estado === 'Enviado' ? 'badge-info' :
                    selectedOrder.estado === 'Cancelado' ? 'badge-danger' : 'badge-warning'
                  }`}>{selectedOrder.estado}</span>
                </span>
              </div>
            </div>

            <h3 style={{ margin: '1.5rem 0 0.75rem 0', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'white' }}>
              Productos Solicitados
            </h3>
            <div className="detail-products-list">
              {selectedOrder.productos?.map((p, idx) => (
                <div key={idx} className="detail-prod-row">
                  <div>
                    <div style={{ fontWeight: 600, color: 'white' }}>{p.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cant: {p.cantidad} x S/ {p.precio.toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'white' }}>S/ {(p.cantidad * p.precio).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
              <span style={{ fontWeight: 600, color: '#94a3b8' }}>Total de la Venta:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>S/ {selectedOrder.total.toFixed(2)}</span>
            </div>

            {selectedOrder.notas && (
              <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Notas adicionales:</span>
                <p style={{ color: '#cbd5e1' }}>{selectedOrder.notas}</p>
              </div>
            )}

            <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setSelectedOrder(null)}>
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

      {/* Premium Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Crear Nuevo Pedido</h2>

            {error && (
              <div className="login-error-badge" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-form-grid">
              
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Cliente Destino *</label>
                  <select
                    className="form-input"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    required
                  >
                    {clients.map(c => (
                      <option key={c.documento} value={c.nombre}>{c.nombre} ({c.documento})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Entrega Programada *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Items Lines */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'white' }}>Productos del Pedido</h3>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleAddLinea}>
                    + Agregar línea
                  </button>
                </div>

                <div className="lines-list">
                  {lineas.map((line, idx) => (
                    <div key={idx} className="line-item-row">
                      <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                        <select
                          className="form-input"
                          value={line.codigo}
                          onChange={(e) => handleLineaChange(idx, 'codigo', e.target.value)}
                        >
                          {products.map(p => (
                            <option key={p.codigo} value={p.codigo}>
                              {p.producto} (S/ {p.precio.toFixed(2)}) - Stock: {p.stock}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ flex: 0.6, marginBottom: 0 }}>
                        <input
                          type="number"
                          min="1"
                          className="form-input"
                          value={line.cantidad}
                          onChange={(e) => handleLineaChange(idx, 'cantidad', e.target.value)}
                          required
                        />
                      </div>

                      {lineas.length > 1 && (
                        <button type="button" className="btn-action-delete" style={{ padding: '0.75rem' }} onClick={() => handleRemoveLinea(idx)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Notas Adicionales / Instrucciones</label>
                <textarea
                  className="form-input"
                  placeholder="Instrucciones especiales, observaciones..."
                  rows="2"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'rgba(14, 165, 233, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>Total Estimado:</span>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8' }}>S/ {calculateTotal().toFixed(2)}</span>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .status-select {
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          transition: var(--transition-smooth);
        }

        .status-select.warning { background: var(--warning-glow); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .status-select.info { background: rgba(14, 165, 233, 0.1); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.4); }
        .status-select.success { background: var(--success-glow); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .status-select.danger { background: var(--danger-glow); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

        .form-input-date-inline {
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          color: white;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .detail-val {
          font-weight: 600;
          color: white;
          margin-top: 0.15rem;
        }

        .detail-products-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-prod-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }

        .lines-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .line-item-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
