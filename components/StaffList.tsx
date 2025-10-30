
import React, { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import Spinner from './Spinner';
import { UserIcon, PhoneIcon, PlusIcon } from './icons';
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
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-3xl font-bold text-brand-text">Staff Members</h4>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-brand-secondary p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-brand-accent p-4 rounded-full">
                  <UserIcon className="w-8 h-8 text-brand-blue" />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-xl text-brand-text">{member.name}</p>
                  <p className="text-brand-text-secondary font-medium">{member.role}</p>
                </div>
              </div>
              <div className="border-t border-brand-accent pt-4 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-3 text-brand-text-secondary">
                  <PhoneIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{member.phone}</span>
                </div>
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-2 bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300 text-sm"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-brand-secondary p-8 rounded-lg">
          <p className="text-brand-text-secondary text-lg">No staff members found.</p>
        </div>
      )}

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
