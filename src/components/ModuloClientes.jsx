import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

export default function ModuloClientes({ clients, onAddClient, onEditClient, onDeleteClient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form State
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [documento, setDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setTipoDocumento('DNI');
    setDocumento('');
    setNombre('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingClient(c);
    setTipoDocumento(c.documento.length > 8 ? 'RUC' : 'DNI');
    setDocumento(c.documento);
    setNombre(c.nombre);
    setTelefono(c.telefono);
    setEmail(c.email || '');
    setDireccion(c.direccion);
    setError('');
    setIsModalOpen(true);
  };

  // Mock API Lookup for DNI / RUC
  const handleMockApiLookup = () => {
    setError('');
    if (!documento) {
      setError('Ingrese un número de documento primero.');
      return;
    }

    if (tipoDocumento === 'DNI' && documento.length !== 8) {
      setError('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    if (tipoDocumento === 'RUC' && documento.length !== 11) {
      setError('El RUC debe tener exactamente 11 dígitos.');
      return;
    }

    setIsSearchingApi(true);

    setTimeout(() => {
      setIsSearchingApi(false);
      // Simulate nice responses
      if (tipoDocumento === 'DNI') {
        const mockNames = [
          'Giancarlos Barboza N.',
          'Carlos Mendoza Rivera',
          'Maria Elena Lopez',
          'Alexander Graham Bell',
          'Jorge Chavez Gonzalez'
        ];
        const randomName = mockNames[Number(documento) % mockNames.length];
        setNombre(randomName);
        setDireccion('Av. Los Precursores 456, Surco, Lima');
      } else {
        const mockCompanies = [
          'USA MY BOX S.A.C.',
          'VADEXA S.A.C.',
          'CODEX S.A.C.',
          'DISTRIBUIDORA NORTE E.I.R.L.',
          'SERVICIOS INTEGRALES LIMA S.A.'
        ];
        const randomCompany = mockCompanies[Number(documento) % mockCompanies.length];
        setNombre(randomCompany);
        setDireccion('Panamericana Sur Km 15.5, San Juan de Miraflores, Lima');
      }
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!documento || !nombre || !telefono || !direccion) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    const payload = {
      documento,
      nombre,
      telefono,
      email,
      direccion
    };

    if (editingClient) {
      onEditClient(payload);
    } else {
      if (clients.some(c => c.documento === documento)) {
        setError('Ya existe un cliente registrado con este documento.');
        return;
      }
      onAddClient(payload);
    }

    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.documento.includes(searchTerm)
  );

  return (
    <div className="module-view">
      <div className="view-header">
        <div>
          <span className="text-secondary">Directorio de Clientes</span>
          <h1 className="gradient-text">Clientes</h1>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Registrar nuevo cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card table-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o número de documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List Table */}
      <div className="glass-card table-wrapper-card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Cliente / Razón Social</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No se encontraron clientes registrados.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => (
                  <tr key={c.documento}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{c.nombre}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.documento}</td>
                    <td>{c.telefono}</td>
                    <td>{c.email || <span className="text-muted">—</span>}</td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.direccion}>
                      {c.direccion}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button className="btn-action-edit" onClick={() => handleOpenEdit(c)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-action-delete" onClick={() => onDeleteClient(c.documento)} title="Eliminar">
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

      {/* Premium Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>
              {editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
            </h2>

            {error && (
              <div className="login-error-badge" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-form-grid">
              
              <div className="form-group">
                <label className="form-label">Tipo de Documento</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipoDoc"
                      value="DNI"
                      checked={tipoDocumento === 'DNI'}
                      onChange={() => setTipoDocumento('DNI')}
                    /> DNI (Persona Natural)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipoDoc"
                      value="RUC"
                      checked={tipoDocumento === 'RUC'}
                      onChange={() => setTipoDocumento('RUC')}
                    /> RUC (Persona Jurídica)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Número de Documento *</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Ingrese ${tipoDocumento}...`}
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ''))}
                    disabled={!!editingClient}
                    required
                  />
                  {!editingClient && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}
                      onClick={handleMockApiLookup}
                      disabled={isSearchingApi}
                    >
                      {isSearchingApi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Buscar
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre Completo / Razón Social *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nombre o denominación social"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Ej. +51 999 999 999"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dirección Completa *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Jr. Flores 123, Urb. Primavera"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingClient ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: white;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
