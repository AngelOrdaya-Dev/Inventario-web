import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';

export default function ActionButton({ type, onClick, title }) {
  const isEdit = type === 'edit';
  const isDelete = type === 'delete';
  const isAdd = type === 'add';
  const isView = type === 'view';

  let Icon = null;
  let colorClass = '';

  if (isEdit) {
    Icon = Edit2;
    colorClass = 'btn-action-edit';
  } else if (isDelete) {
    Icon = Trash2;
    colorClass = 'btn-action-delete';
  } else if (isAdd) {
    Icon = Plus;
    colorClass = 'btn-action-add';
  } else if (isView) {
    Icon = Eye;
    colorClass = 'btn-action-view';
  }

  return (
    <motion.button
      className={`btn-action ${colorClass}`}
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.15, rotate: isEdit ? 5 : isDelete ? -5 : 0 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(31, 41, 55, 0.6)',
        border: `1px solid ${isEdit ? 'rgba(14, 165, 233, 0.3)' : isDelete ? 'rgba(239, 68, 68, 0.3)' : isView ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
        color: isEdit ? '#10b981' : isDelete ? '#ef4444' : isView ? '#34d399' : '#10b981',
        padding: '0.4rem',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '0.5rem'
      }}
    >
      {Icon && <Icon size={16} />}
    </motion.button>
  );
}
