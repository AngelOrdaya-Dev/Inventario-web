import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin, UserCheck } from 'lucide-react';

export default function ModuloClientes({ clients, setClients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedClient, setSelectedClient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    documentId: ''
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.documentId.includes(searchTerm)
  );

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', phone: '', address: '', documentId: '' });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setModalMode('edit');
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      documentId: client.documentId
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newClient = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        documentId: formData.documentId,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setClients([...clients, newClient]);
    } else {
      const updated = clients.map(c => c.id === selectedClient.id ? {
        ...c,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        documentId: formData.documentId
      } : c);
      setClients(updated);
    }
    setShowModal(false);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div>
          <span className="badge badge-success">SOCIOS</span>
          <h2 className="module-title">Directorio de Clientes</h2>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="filters-bar glass-card">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o RUC/DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>DNI / RUC</th>
              <th>Nombre o Razón Social</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td className="font-mono text-cyan">{client.documentId}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="client-avatar-mini">
                      {client.name[0].toUpperCase()}
                    </div>
                    <span className="font-semibold">{client.name}</span>
                  </div>
                </td>
                <td>
                  <span className="text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> {client.email}
                  </span>
                </td>
                <td>
                  <span className="text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {client.phone}
                  </span>
                </td>
                <td>
                  <span className="text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {client.address}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action edit" onClick={() => openEditModal(client)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-action delete" onClick={() => handleDelete(client.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">DNI / RUC / Doc. Identidad</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.documentId}
                    onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
    </div>
  );
}
