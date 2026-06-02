import React, { useState } from 'react';
import { Box, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        (email === 'admin@corvex.com' && password === 'admin123') ||
        (email === 'empleado@corvex.com' && password === 'empleado123') ||
        (email === 'usuario@corvex.com' && password === '123456') ||
        (email !== '' && password.length >= 4)
      ) {
        const role = email.includes('admin') ? 'Administrador' : 'Empleado';
        onLoginSuccess({ email, role, name: role === 'Administrador' ? 'Giancarlos Barboza' : 'Colaborador Corvex' });
      } else {
        setError('Credenciales inválidas. Intente con usuario@corvex.com y contraseña "123456".');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-glow"></div>
        <div className="brand-header">
          <div className="brand-icon-wrapper">
            <Box size={36} className="brand-logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">CORVEX</h1>
            <p className="brand-subtitle">DISTRIBUIDORA</p>
          </div>
        </div>
        
        <div className="brand-pitch">
          <h2>Gestión de productos, clientes, pedidos e inventario.</h2>
          <p>La plataforma inteligente todo en uno diseñada para optimizar los flujos de distribución y almacenamiento de CORVEX en tiempo real.</p>
        </div>

        <div className="brand-footer">
          <p>© 2026 CORVEX Distribuidora. Todos los derechos reservados.</p>
        </div>
      </div>

      <motion.div 
        className="login-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="form-container glass-card">
          <div className="form-header">
            <span className="badge badge-info">ACCESO AL SISTEMA</span>
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <motion.div 
              className="login-error-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShieldAlert size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="usuario@corvex.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="btn-primary login-btn" 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>Ingresar <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="form-help">
            <p>¿Problemas para ingresar? <button className="link-button" onClick={() => setShowContact(true)}>Contacta al administrador</button></p>
          </div>
        </div>
      </motion.div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      <style>{`
        .login-screen {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: #070a13;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10000;
          overflow: hidden;
        }
        .login-left {
          flex: 1.2;
          background: radial-gradient(circle at 0% 0%, #0c152b 0%, #060814 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4rem;
          position: relative;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
        .login-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          filter: blur(50px);
          pointer-events: none;
        }
        .brand-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .brand-icon-wrapper {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 0.75rem;
          border-radius: 12px;
          color: white;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }
        .brand-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #10b981;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        .brand-pitch {
          max-width: 480px;
          margin: auto 0;
        }
        .brand-pitch h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .brand-pitch p {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.6;
        }
        .brand-footer p {
          color: #475569;
          font-size: 0.85rem;
        }
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background: #070911;
          position: relative;
        }
        .form-container {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem !important;
          border-radius: 24px !important;
        }
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 0.75rem;
          color: #ffffff;
        }
        .form-header p {
          color: #94a3b8;
          margin-top: 0.5rem;
          font-size: 0.95rem;
        }
        .input-with-icon {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
          transition: var(--transition-smooth);
        }
        .input-with-icon .form-input {
          padding-left: 3rem;
        }
        .login-btn {
          width: 100%;
          padding: 0.875rem !important;
          font-size: 1rem;
          margin-top: 1.5rem;
        }
        .login-error-badge {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          animation: slideUp 0.2s ease;
        }
        .form-help {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .login-screen { flex-direction: column; }
          .login-left { display: none; }
          .login-right { flex: 1; padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
