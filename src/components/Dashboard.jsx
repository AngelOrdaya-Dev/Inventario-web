import React from 'react';
import { Box, Users, ShoppingCart, TrendingUp, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export default function Dashboard({ products, clients, orders, onNavigate }) {
  // Compute metrics
  const totalProducts = products.length;
  const totalClients = clients.length;
  const totalOrders = orders.length;
  const totalUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);

  // Critical Low Stock Products (stock <= stockMinimo)
  const lowStockProducts = products.filter(p => Number(p.stock) <= Number(p.stockMinimo));

  // Recent Orders
  const recentOrders = [...orders].slice(-4).reverse();

  // Categories Distribution
  const categories = [...new Set(products.map(p => p.categoria || 'Sin Categoría'))];

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Resumen General</span>
          <h1 className="gradient-text">Dashboard de Control</h1>
        </div>
        <div className="live-indicator">
          <span className="ping-dot"></span>
          <span className="ping-label">En Línea</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card" onClick={() => onNavigate('productos')}>
          <div className="kpi-icon-wrapper blue">
            <Package size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Productos Únicos</span>
            <span className="kpi-value">{totalProducts}</span>
          </div>
          <div className="kpi-glow blue"></div>
        </div>

        <div className="glass-card kpi-card" onClick={() => onNavigate('clientes')}>
          <div className="kpi-icon-wrapper green">
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Clientes Registrados</span>
            <span className="kpi-value">{totalClients}</span>
          </div>
          <div className="kpi-glow green"></div>
        </div>

        <div className="glass-card kpi-card" onClick={() => onNavigate('pedidos')}>
          <div className="kpi-icon-wrapper orange">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Pedidos Totales</span>
            <span className="kpi-value">{totalOrders}</span>
          </div>
          <div className="kpi-glow orange"></div>
        </div>

        <div className="glass-card kpi-card" onClick={() => onNavigate('inventario')}>
          <div className="kpi-icon-wrapper purple">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Unidades en Almacén</span>
            <span className="kpi-value">{totalUnits}</span>
          </div>
          <div className="kpi-glow purple"></div>
        </div>
      </div>

      {/* Main Section: Alerts and Recent Activity */}
      <div className="dashboard-content-layout">
        {/* Alerts & Critical Stock */}
        <div className="glass-card flex-1">
          <div className="section-title-wrapper">
            <div className="flex-align gap-2">
              <AlertTriangle className="text-warning" size={20} />
              <h3>Alertas de Inventario Crítico</h3>
            </div>
            <span className="badge badge-danger">{lowStockProducts.length} Críticos</span>
          </div>

          <div className="alert-list">
            {lowStockProducts.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={32} className="text-success" />
                <p>¡Todo en orden! Todos los productos están por encima del stock mínimo establecido.</p>
              </div>
            ) : (
              lowStockProducts.map(p => {
                const pct = Math.round((Number(p.stock) / Number(p.stockMinimo || 1)) * 100);
                return (
                  <div key={p.codigo} className="alert-item" onClick={() => onNavigate('inventario')}>
                    <div className="alert-info">
                      <span className="alert-product-name">{p.producto}</span>
                      <span className="alert-product-meta">Cód: {p.codigo} | Mínimo: {p.stockMinimo} {p.unidad}</span>
                    </div>
                    <div className="alert-metric">
                      <div className="alert-bar-bg">
                        <div
                          className="alert-bar-fill"
                          style={{ width: `${Math.min(pct, 100)}%`, background: pct < 50 ? '#ef4444' : '#f59e0b' }}
                        ></div>
                      </div>
                      <span className="alert-stock-val">{p.stock} <span className="text-muted">/ {p.stockMinimo}</span></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card flex-1">
          <div className="section-title-wrapper">
            <h3>Últimos Pedidos</h3>
            <button className="btn-text-link" onClick={() => onNavigate('pedidos')}>Ver todos</button>
          </div>

          <div className="recent-orders-list">
            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart size={32} className="text-muted" />
                <p>No hay pedidos registrados en el sistema.</p>
              </div>
            ) : (
              recentOrders.map(o => (
                <div key={o.id} className="recent-order-item">
                  <div className="order-main-info">
                    <span className="order-id"># {o.id}</span>
                    <span className="order-customer">{o.cliente}</span>
                  </div>
                  <span className="order-date">{o.fecha}</span>
                  <span className="order-total">S/ {Number(o.total).toFixed(2)}</span>
                  <span className={`badge ${o.estado === 'Entregado' ? 'badge-success' :
                      o.estado === 'Enviado' ? 'badge-info' :
                        o.estado === 'Cancelado' ? 'badge-danger' : 'badge-warning'
                    }`}>{o.estado}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #34d399;
        }

        .ping-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .kpi-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
        }

        .kpi-icon-wrapper {
          padding: 1rem;
          border-radius: 12px;
          color: white;
          z-index: 2;
        }

        .kpi-icon-wrapper.blue { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); }
        .kpi-icon-wrapper.green { background: linear-gradient(135deg, #10b981 0%, #047857 100%); }
        .kpi-icon-wrapper.orange { background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%); }
        .kpi-icon-wrapper.purple { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }

        .kpi-details {
          display: flex;
          flex-direction: column;
          z-index: 2;
        }

        .kpi-title {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .kpi-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.85rem;
          font-weight: 700;
          color: white;
          margin-top: 0.25rem;
        }

        .kpi-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          right: -20px;
          bottom: -20px;
          border-radius: 50%;
          filter: blur(40px);
          z-index: 1;
          opacity: 0.15;
          pointer-events: none;
        }
        .kpi-glow.blue { background: #0ea5e9; }
        .kpi-glow.green { background: #10b981; }
        .kpi-glow.orange { background: #f59e0b; }
        .kpi-glow.purple { background: #8b5cf6; }

        .dashboard-content-layout {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .flex-1 {
          flex: 1;
          min-width: 320px;
        }

        .section-title-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .section-title-wrapper h3 {
          font-size: 1.15rem;
          color: white;
        }

        .flex-align {
          display: flex;
          align-items: center;
        }

        .btn-text-link {
          background: none;
          border: none;
          color: #38bdf8;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
          transition: var(--transition-smooth);
        }

        .btn-text-link:hover {
          color: #0ea5e9;
          text-decoration: underline;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
          color: #64748b;
          gap: 1rem;
        }

        .empty-state p {
          font-size: 0.95rem;
          max-width: 320px;
        }

        .alert-list, .recent-orders-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .alert-item:hover {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .alert-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .alert-product-name {
          font-weight: 600;
          color: white;
          font-size: 0.95rem;
        }

        .alert-product-meta {
          font-size: 0.75rem;
          color: #64748b;
        }

        .alert-metric {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          min-width: 120px;
        }

        .alert-bar-bg {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
        }

        .alert-bar-fill {
          height: 100%;
          border-radius: 999px;
        }

        .alert-stock-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
        }

        .recent-order-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: rgba(31, 41, 55, 0.3);
          border-radius: 12px;
          font-size: 0.9rem;
        }

        .order-main-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1.2;
        }

        .order-id {
          font-weight: 700;
          color: #38bdf8;
        }

        .order-customer {
          color: white;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 150px;
        }

        .order-date {
          color: #64748b;
          font-size: 0.8rem;
          flex: 0.8;
          text-align: center;
        }

        .order-total {
          font-weight: 700;
          color: white;
          flex: 1;
          text-align: right;
          padding-right: 1rem;
        }
      `}</style>
    </div>
  );
}
