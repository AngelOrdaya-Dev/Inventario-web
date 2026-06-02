import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionButton from './ActionButton';

export default function ModuloClientes({ clients, onAddClient, onEditClient, onDeleteClient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedClient, setSelectedClient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    documento: ''
  });

  const filteredClients = clients.filter(client => 
    (client.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (client.documento || '').includes(searchTerm)
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ nombre: '', email: '', telefono: '', direccion: '', documento: '' });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setModalMode('edit');
    setSelectedClient(client);
    setFormData({
      nombre: client.nombre,
      email: client.email,
      telefono: client.telefono,
      direccion: client.direccion,
      documento: client.documento
    });
    setShowModal(true);
  };

  const handleDelete = (doc) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      onDeleteClient(doc);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientPayload = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      documento: formData.documento
    };

    if (modalMode === 'add') {
      onAddClient(clientPayload);
    } else {
      onEditClient(clientPayload);
    }
    setShowModal(false);
  };

  return (
    <motion.div 
      className="module-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="module-header">
        <div>
          <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>SOCIOS</span>
          <h2 className="module-title">Clientes</h2>
        </div>
        <motion.button 
          className="btn-primary" 
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: '#10b981', color: '#050505', border: 'none', fontWeight: 'bold' }}
        >
          <Plus size={18} /> Registrar nuevo cliente
        </motion.button>
      </div>

      <div className="filters-bar glass-card">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o número de documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Cliente / Razón Social</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.documento}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="client-avatar-mini">
                      {client.nombre ? client.nombre[0].toUpperCase() : 'C'}
                    </div>
                    <span className="font-semibold" style={{ color: 'white' }}>{client.nombre}</span>
                  </div>
                </td>
                <td className="font-mono text-emerald">{client.documento}</td>
                <td>
                  <span className="text-secondary">
                    {client.telefono}
                  </span>
                </td>
                <td>
                  <span className="text-secondary">
                    {client.email}
                  </span>
                </td>
                <td>
                  <span className="text-secondary">
                    {client.direccion}
                  </span>
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex' }}>
                    <ActionButton type="edit" onClick={() => openEditModal(client)} title="Editar" />
                    <ActionButton type="delete" onClick={() => handleDelete(client.documento)} title="Eliminar" />
                  </div>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No se encontraron clientes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animated zoomIn">
            <h3>{modalMode === 'add' ? 'Registrar Cliente' : 'Editar Cliente'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre o Razón Social</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Documento (DNI/RUC)</label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'edit'}
                    className="form-input"
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {modalMode === 'add' ? 'Registrar' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .client-avatar-mini {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </motion.div>
  );
}
