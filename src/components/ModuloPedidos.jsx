import React, { useState } from 'react';
import { Plus, Search, Eye, Edit2, ShoppingBag, Trash2, Calendar, FileText } from 'lucide-react';

export default function ModuloPedidos({ orders, setOrders, products, setProducts, clients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [clientId, setClientId] = useState('');
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);

  const filteredOrders = orders.filter(order => {
    const client = clients.find(c => c.id === order.clientId);
    return client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openAddModal = () => {
    setClientId(clients[0]?.id || '');
    setOrderItems([{ productId: products[0]?.id || '', quantity: 1 }]);
    setShowModal(true);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: products[0]?.id || '', quantity: 1 }]);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    let total = 0;
    const items = orderItems.map(item => {
      const prod = products.find(p => p.id === parseInt(item.productId));
      const quantity = parseInt(item.quantity);
      const subtotal = prod ? prod.price * quantity : 0;
      total += subtotal;

      // Update inventory stock
      if (prod) {
        prod.stock -= quantity;
      }

      return {
        productId: parseInt(item.productId),
        name: prod ? prod.name : 'Producto',
        price: prod ? prod.price : 0,
        quantity,
        subtotal
      };
    });

    // Save updated products stock
    setProducts([...products]);

    const newOrder = {
      id: Date.now(),
      orderNumber: `PED-${Math.floor(10000 + Math.random() * 90000)}`,
      clientId: parseInt(clientId),
      date: new Date().toISOString().split('T')[0],
      items,
      total,
      status: 'Completado'
    };

    setOrders([newOrder, ...orders]);
    setShowModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-warning">VENTAS</span>
          <h2 className="module-title">Pedidos y Facturación</h2>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Crear Pedido
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
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const client = clients.find(c => c.id === order.clientId);
              return (
                <tr key={order.id}>
                  <td className="font-mono text-cyan">{order.orderNumber}</td>
                  <td><span className="font-semibold">{client?.name || 'Cliente Desconocido'}</span></td>
                  <td>
                    <span className="text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> {order.date}
                    </span>
                  </td>
                  <td className="font-semibold">${order.total.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success">Completado</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" onClick={() => handleViewOrder(order)} title="Ver Detalle">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
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
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.documentId})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Ítems del Pedido</label>
                  <button type="button" className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={handleAddItem}>
                    + Añadir Producto
                  </button>
                </div>

                {orderItems.map((item, index) => {
                  const selectedProd = products.find(p => p.id === parseInt(item.productId));
                  return (
                    <div key={index} className="form-row" style={{ marginBottom: '0.5rem', alignItems: 'center' }}>
                      <div className="form-group col-7" style={{ margin: 0 }}>
                        <select
                          className="form-input"
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                              {p.name} - ${p.price.toFixed(2)} ({p.stock} disp.)
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
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
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
              <h3>Detalle de Pedido {selectedOrder.orderNumber}</h3>
            </div>
            
            <div className="order-details-card">
              <p><strong>Cliente:</strong> {clients.find(c => c.id === selectedOrder.clientId)?.name}</p>
              <p><strong>Fecha Emisión:</strong> {selectedOrder.date}</p>
              <p><strong>Estado Pago:</strong> <span className="badge badge-success">Pagado / Completado</span></p>
            </div>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Productos Adquiridos</h4>
            <div className="details-items-list">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="details-item-row">
                  <div>
                    <span className="font-semibold text-white">{item.name}</span>
                    <br />
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{item.quantity} unidades x ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="font-semibold text-cyan">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="details-total-row">
              <span>TOTAL FACTURADO</span>
              <span className="total-amount">${selectedOrder.total.toFixed(2)}</span>
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
