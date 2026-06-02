import React from 'react';
import { LayoutDashboard, ShoppingCart, Users, FolderKanban, ClipboardList, LogOut, Box } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productos', label: 'Productos', icon: FolderKanban },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'inventario', label: 'Inventario', icon: ClipboardList },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Box size={24} />
        </div>
        <div>
          <span className="brand-name">CORVEX</span>
          <span className="brand-badge">PRO</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="nav-active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuario'}</span>
            <span className="user-role">{user?.role || 'Personal'}</span>
          </div>
        </div>

        <button className="btn-logout" onClick={onLogout} title="Cerrar Sesión">
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </div>

      <style>{`
        .app-sidebar {
          width: 260px;
          height: 100vh;
          background: #0b0f19;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          padding: 1.75rem 1.25rem;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .brand-logo {
          background: linear-gradient(135deg, #059669 0%, #022c22 100%);
          padding: 0.5rem;
          border-radius: 8px;
          color: white;
        }

        .brand-name {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .brand-badge {
          background: rgba(14, 165, 233, 0.15);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #10b981;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-left: 0.5rem;
          vertical-align: middle;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border: none;
          background: transparent;
          color: #94a3b8;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
          position: relative;
          width: 100%;
        }

        .nav-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: #10b981;
          background: rgba(14, 165, 233, 0.08);
          font-weight: 600;
        }

        .nav-icon {
          transition: transform 0.2s ease;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.05);
        }

        .nav-active-indicator {
          position: absolute;
          right: 0;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: #10b981;
          border-radius: 4px 0 0 4px;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
        }

        .sidebar-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 0.95rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .user-role {
          font-size: 0.75rem;
          color: #64748b;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #f87171;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }

        @media (max-width: 1024px) {
          .app-sidebar {
            width: 80px;
            padding: 1.5rem 0.5rem;
            align-items: center;
          }
          .brand-name, .brand-badge, .nav-label, .nav-active-indicator, .user-info, .btn-logout span {
            display: none;
          }
          .sidebar-brand {
            margin-bottom: 2rem;
            padding-left: 0;
          }
          .nav-item {
            justify-content: center;
            padding: 0.875rem;
          }
          .user-profile {
            justify-content: center;
            padding: 0;
          }
        }
      `}</style>
    </aside>
  );
}
