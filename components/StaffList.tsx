
import React, { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import Spinner from './Spinner';
import { UsersIcon, EnvelopeIcon, PhoneIcon, PlusIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import AddNewStaffForm from './AddNewStaffForm';

const StaffList: React.FC = () => {
  const { staff, loading, error } = useStaff();
  const { user } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const isAdmin = user?.email === 'admin@admin.com';

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-center text-brand-red">Error loading staff: {error.message}</p>;
  }

  return (
    <>
      <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-brand-text">Staff Members</h2>
          {isAdmin && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              aria-label="Add new staff member"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
        {staff.length > 0 ? (
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="bg-brand-accent p-4 rounded-lg flex items-center gap-4">
                <div className="bg-brand-primary p-3 rounded-full">
                  <UsersIcon className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <p className="font-bold text-lg text-brand-text">{member.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <EnvelopeIcon className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-sm text-brand-text-secondary">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <PhoneIcon className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-sm text-brand-text-secondary">{member.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 rounded-lg">
            <p className="text-brand-text-secondary text-lg">No staff members found.</p>
          </div>
        )}
      </div>

      {isFormVisible && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsFormVisible(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full p-4 flex justify-center">
            <AddNewStaffForm onClose={() => setIsFormVisible(false)} />
          </div>
        </>
      )}
    </>
  );
};

export default StaffList;
