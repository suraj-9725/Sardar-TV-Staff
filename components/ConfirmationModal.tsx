import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  variant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, variant = 'primary' }) => {
  if (!isOpen) return null;

  const confirmButtonClasses = {
    primary: 'bg-brand-blue hover:bg-blue-600',
    danger: 'bg-brand-red hover:bg-red-600',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div 
        className="bg-brand-secondary p-6 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h3 id="confirmation-title" className="text-xl font-bold text-brand-text mb-4">{title}</h3>
        <div className="text-brand-text-secondary mb-6">
          {message}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            type="button"
            className="bg-brand-accent hover:bg-gray-300 text-brand-text-secondary font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className={`text-white font-bold py-2 px-4 rounded-lg transition duration-300 ${confirmButtonClasses[variant]}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
