import React, { useState } from 'react';
import { Plus, Search, Eye, ShoppingBag, Trash2, Calendar } from 'lucide-react';

export default function ModuloPedidos({ orders, products, clients, onAddOrder, onDeleteOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [orderItems, setOrderItems] = useState([{ codigo: '', cantidad: 1 }]);

  const filteredOrders = orders.filter(order => {
    return (order.cliente || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
           (order.id || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openAddModal = () => {
    setClientName(clients[0]?.nombre || '');
    setOrderItems([{ codigo: products[0]?.codigo || '', cantidad: 1 }]);
    setShowModal(true);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { codigo: products[0]?.codigo || '', cantidad: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...orderItems];
    updated.splice(index, 1);
    setOrderItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleDelete = (orderId) => {
    if (confirm(`¿Está seguro de eliminar el pedido ${orderId}?`)) {
      onDeleteOrder(orderId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let total = 0;
    const items = orderItems.map(item => {
      const prod = products.find(p => p.codigo === item.codigo);
      const cantidad = parseInt(item.cantidad);
      const subtotal = prod ? prod.precio * cantidad : 0;
      total += subtotal;

      return {
        codigo: item.codigo,
        nombre: prod ? prod.producto : 'Producto',
        precio: prod ? prod.precio : 0,
        cantidad,
        subtotal
      };
    });

    const newOrder = {
      id: `#${Math.floor(100 + Math.random() * 900)}`,
      cliente: clientName,
      fecha: new Date().toLocaleDateString('es-ES'),
      fechaEntrega: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
      productos: items,
      total,
      estado: 'Pendiente'
    };

    onAddOrder(newOrder);
    setShowModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-warning">VENTAS</span>
          <h2 className="module-title">Pedidos</h2>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Crear nuevo pedido
        </button>
      </div>

      <div className="filters-bar glass-card">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por N° Pedido o Cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>N° Pedido</th>
              <th>Cliente</th>
              <th>Fecha de Registro</th>
              <th>Total Estimado</th>
              <th>Estado</th>
              <th>Fecha de Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              return (
                <tr key={order.id}>
                  <td className="font-mono text-cyan">{order.id}</td>
                  <td><span className="font-semibold" style={{ color: 'white' }}>{order.cliente}</span></td>
                  <td>
                    <span className="text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> {order.fecha}
                    </span>
                  </td>
                  <td className="font-semibold">S/ {Number(order.total).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.estado === 'Entregado' ? 'badge-success' :
                      order.estado === 'Enviado' ? 'badge-info' :
                      order.estado === 'Cancelado' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="text-secondary">{order.fechaEntrega}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" onClick={() => handleViewOrder(order)} title="Ver Detalle">
                        <Eye size={16} />
                      </button>
                      <button className="btn-action delete" onClick={() => handleDelete(order.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No se encontraron pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animated zoomIn" style={{ maxWidth: '600px' }}>
            <h3>Registrar Nuevo Pedido</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <select
                  className="form-input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                >
                  {clients.map(c => (
                    <option key={c.documento} value={c.nombre}>{c.nombre} ({c.documento})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Ítems del Pedido</label>
                  <button type="button" className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={handleAddItem}>
                    + Añadir Producto
                  </button>
                </div>

                {orderItems.map((item, index) => {
                  const selectedProd = products.find(p => p.codigo === item.codigo);
                  return (
                    <div key={index} className="form-row" style={{ marginBottom: '0.5rem', alignItems: 'center' }}>
                      <div className="form-group col-7" style={{ margin: 0 }}>
                        <select
                          className="form-input"
                          value={item.codigo}
                          onChange={(e) => handleItemChange(index, 'codigo', e.target.value)}
                        >
                          {products.map(p => (
                            <option key={p.codigo} value={p.codigo} disabled={p.stock <= 0}>
                              {p.producto} - S/ {p.precio.toFixed(2)} ({p.stock} disp.)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-3" style={{ margin: 0 }}>
                        <input
                          type="number"
                          min="1"
                          max={selectedProd ? selectedProd.stock : 99}
                          required
                          className="form-input"
                          placeholder="Cant."
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                        />
                      </div>
                      <div className="form-group col-2" style={{ margin: 0, textAlign: 'center' }}>
                        <button type="button" className="btn-action delete" onClick={() => handleRemoveItem(index)} disabled={orderItems.length === 1}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Procesar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animated zoomIn" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <ShoppingBag size={24} className="text-cyan" />
              <h3>Detalle de Pedido {selectedOrder.id}</h3>
            </div>
            
            <div className="order-details-card">
              <p><strong>Cliente:</strong> {selectedOrder.cliente}</p>
              <p><strong>Fecha Emisión:</strong> {selectedOrder.fecha}</p>
              <p><strong>Estado Pago:</strong> <span className="badge badge-success">Pagado / Completado</span></p>
            </div>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Productos Adquiridos</h4>
            <div className="details-items-list">
              {(selectedOrder.productos || []).map((item, idx) => (
                <div key={idx} className="details-item-row">
                  <div>
                    <span className="font-semibold text-white">{item.nombre}</span>
                    <br />
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{item.cantidad} unidades x S/ {Number(item.precio).toFixed(2)}</span>
                  </div>
                  <span className="font-semibold text-cyan">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="details-total-row">
              <span>TOTAL FACTURADO</span>
              <span className="total-amount">S/ {Number(selectedOrder.total).toFixed(2)}</span>
            </div>

            <div className="modal-footer" style={{ marginTop: '2rem' }}>
              <button type="button" className="btn-primary" onClick={() => setViewModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .order-details-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.95rem;
        }
        .details-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }
        .details-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .details-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-weight: 800;
          color: white;
        }
        .total-amount {
          font-size: 1.5rem;
          color: #38bdf8;
        }
      `}</style>
    </div>
  );
}
