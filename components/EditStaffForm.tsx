import React, { useState } from 'react';
import { updateStaffMember } from '../services/staffService';
import { XIcon } from './icons';
import { Staff } from '../types';

interface EditStaffFormProps {
  staff: Staff;
  onClose: () => void;
}

const EditStaffForm: React.FC<EditStaffFormProps> = ({ staff, onClose }) => {
  const [name, setName] = useState(staff.name);
  const [phone, setPhone] = useState(staff.phone);
  const [role, setRole] = useState(staff.role);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !role) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateStaffMember(staff.id, { name, phone, role });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update staff member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg relative max-w-lg w-full">
       <button
        onClick={onClose}
        className="absolute top-3 right-3 text-brand-text-secondary hover:text-brand-text transition-colors"
        aria-label="Close form"
      >
        <XIcon className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-brand-text">Edit Staff Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
          disabled={isLoading}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
          disabled={isLoading}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
          disabled={isLoading}
          required
        />

        {error && <p className="text-brand-red text-sm">{error}</p>}
        
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-brand-accent hover:bg-gray-300 text-brand-text-secondary font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-brand-accent disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaffForm;