import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, CheckCircle } from 'lucide-react';

export default function ContactModal({ onClose }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    // Simular envío de mensaje
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100000
        }}
      >
        <motion.div 
          className="glass-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '90%', maxWidth: '450px', padding: '2rem', position: 'relative' }}
        >
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'transparent', border: 'none', color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          {!sent ? (
            <>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#10b981' }}>Contacta al Administrador</h3>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Si tienes algún problema con tus credenciales o el sistema, envíanos un mensaje y te ayudaremos.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: '#e5e7eb' }}>
                    Mensaje
                  </label>
                  <textarea
                    required
                    className="form-input"
                    placeholder="Describe tu problema aquí..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      background: 'rgba(31, 41, 55, 0.5)', border: '1px solid #374151',
                      color: 'white', resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={onClose}
                    style={{
                      padding: '0.5rem 1rem', background: 'transparent', 
                      border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <motion.button 
                    type="submit" 
                    className="btn-primary"
                    disabled={sending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.5rem 1.5rem', background: '#10b981',
                      border: 'none', borderRadius: '8px', color: 'black',
                      fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      cursor: sending ? 'not-allowed' : 'pointer',
                      opacity: sending ? 0.7 : 1
                    }}
                  >
                    {sending ? 'Enviando...' : (
                      <>Enviar <Send size={16} /></>
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem 0' }}
            >
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>¡Mensaje Enviado!</h3>
              <p style={{ color: '#9ca3af' }}>El administrador se pondrá en contacto pronto.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
