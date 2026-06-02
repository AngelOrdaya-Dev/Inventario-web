import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ModuloProductos from './components/ModuloProductos';
import ModuloClientes from './components/ModuloClientes';
import ModuloPedidos from './components/ModuloPedidos';
import ModuloInventario from './components/ModuloInventario';
import { Bell, CheckCircle2 } from 'lucide-react';

// Initial mock dataset from PDF screenshots
const INITIAL_PRODUCTS = [
  { codigo: '001381450', producto: 'arroz', categoria: 'General', precio: 4.30, unidad: 'paquetes', stock: 35, stockMinimo: 15, descripcion: 'Arroz costeño familiar superior' },
  { codigo: '001201240', producto: 'atun', categoria: 'General', precio: 3.50, unidad: 'cajas', stock: 45, stockMinimo: 12, descripcion: 'Atún Real en trozos de aceite vegetal' },
  { codigo: '0012578956', producto: 'Fideos', categoria: 'General', precio: 6.40, unidad: 'bolsas', stock: 20, stockMinimo: 13, descripcion: 'Fideos spaghetti Don Vittorio' },
];

const INITIAL_CLIENTS = [
  { documento: '23244747', nombre: 'Codex.sac', telefono: '987346781', email: 'codex@gmail.com', direccion: 'Jr flores 1234' },
  { documento: '49495585', nombre: 'USA MY BOX S.A.C.', telefono: '934556789', email: 'admin@distripro.com', direccion: 'Panamericana AvMandiola.98 AvAlfr...' },
  { documento: '34781456', nombre: 'VADEXA.SAC', telefono: '945680235', email: 'vad@gmail.com', direccion: 'Independencia Flores 234' },
];

const INITIAL_ORDERS = [
  { id: '#005', cliente: 'USA MY BOX S.A.C.', fecha: '12/5/2026', fechaEntrega: '2026-07-07', total: 4.30, estado: 'Cancelado', productos: [{ codigo: '001381450', nombre: 'arroz', cantidad: 1, precio: 4.30 }] },
  { id: '#004', cliente: 'VADEXA.SAC', fecha: '12/5/2026', fechaEntrega: '2026-07-05', total: 14.00, estado: 'Pendiente', productos: [{ codigo: '001201240', nombre: 'atun', cantidad: 4, precio: 3.50 }] },
  { id: '#003', cliente: 'Codex.sac', fecha: '12/5/2026', fechaEntrega: '2026-08-07', total: 6.40, estado: 'Enviado', productos: [{ codigo: '0012578956', nombre: 'Fideos', cantidad: 1, precio: 6.40 }] },
  { id: '#002', cliente: 'VADEXA.SAC', fecha: '11/5/2026', fechaEntrega: '2026-04-30', total: 6.40, estado: 'Pendiente', productos: [{ codigo: '0012578956', nombre: 'Fideos', cantidad: 1, precio: 6.40 }] },
  { id: '#001', cliente: 'USA MY BOX S.A.C.', fecha: '11/5/2026', fechaEntrega: '2026-06-12', total: 8.60, estado: 'Entregado', productos: [{ codigo: '001381450', nombre: 'arroz', cantidad: 2, precio: 4.30 }] },
];

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('corvex_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('corvex_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('corvex_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('corvex_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Notification Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('corvex_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('corvex_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('corvex_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('corvex_user', JSON.stringify(userData));
    showToast(`¡Sesión iniciada como ${userData.role}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('corvex_user');
    showToast('Sesión cerrada correctamente.', 'info');
  };

  // PRODUCTS ACTIONS
  const handleAddProduct = (p) => {
    setProducts([...products, p]);
    showToast(`Producto "${p.producto}" agregado.`);
  };

  const handleEditProduct = (updated) => {
    setProducts(products.map(p => p.codigo === updated.codigo ? updated : p));
    showToast(`Producto "${updated.producto}" actualizado.`);
  };

  const handleDeleteProduct = (code) => {
    setProducts(products.filter(p => p.codigo !== code));
    showToast('Producto eliminado del catálogo.', 'error');
  };

  // CLIENTS ACTIONS
  const handleAddClient = (c) => {
    setClients([...clients, c]);
    showToast(`Cliente "${c.nombre}" registrado.`);
  };

  const handleEditClient = (updated) => {
    setClients(clients.map(c => c.documento === updated.documento ? updated : c));
    showToast(`Cliente "${updated.nombre}" actualizado.`);
  };

  const handleDeleteClient = (doc) => {
    setClients(clients.filter(c => c.documento !== doc));
    showToast('Cliente removido del directorio.', 'error');
  };

  // ORDERS ACTIONS
  const handleAddOrder = (o) => {
    setOrders([...orders, o]);
    // Deduct stock automatically
    const updatedProducts = products.map(p => {
      const lineItem = o.productos.find(item => item.codigo === p.codigo);
      if (lineItem) {
        return { ...p, stock: Math.max(0, p.stock - lineItem.cantidad) };
      }
      return p;
    });
    setProducts(updatedProducts);
    showToast(`Pedido ${o.id} creado con éxito y stock descontado.`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
    showToast(`Estado del pedido ${orderId} actualizado a: ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.id !== orderId));
    showToast(`Pedido ${orderId} eliminado del sistema.`, 'error');
  };

  // INVENTORY ACTIONS
  const handleQuickReplenish = (code, val) => {
    setProducts(products.map(p => p.codigo === code ? { ...p, stock: val } : p));
    const prod = products.find(p => p.codigo === code);
    showToast(`Stock de "${prod?.producto || 'Producto'}" actualizado a ${val}.`);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} clients={clients} orders={orders} onNavigate={setActiveTab} />;
      case 'productos':
        return (
          <ModuloProductos
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'clientes':
        return (
          <ModuloClientes
            clients={clients}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case 'pedidos':
        return (
          <ModuloPedidos
            orders={orders}
            products={products}
            clients={clients}
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        );
      case 'inventario':
        return (
          <ModuloInventario
            products={products}
            onQuickReplenish={handleQuickReplenish}
          />
        );
      default:
        return <Dashboard products={products} clients={clients} orders={orders} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      
      <main className="main-content">
        {/* Dynamic header / Toast widget bar */}
        <div style={{ display: 'none' }}></div>
        {renderContent()}
      </main>

      {/* Premium Notification Toast */}
      {toast && (
        <div className={`premium-toast ${toast.type}`}>
          <CheckCircle2 size={20} />
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        .premium-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(17, 24, 39, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          z-index: 11000;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-toast.success {
          border-left: 4px solid #10b981;
        }

        .premium-toast.error {
          border-left: 4px solid #ef4444;
        }

        .premium-toast.info {
          border-left: 4px solid #10b981;
        }
      `}</style>
    </div>
  );
}
