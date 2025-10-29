import React from 'react';
import { useStaff } from '../hooks/useStaff';
import Spinner from './Spinner';
import { UsersIcon, EnvelopeIcon, PhoneIcon } from './icons';

const StaffList: React.FC = () => {
  const { staff, loading, error } = useStaff();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-center text-brand-red">Error loading staff: {error.message}</p>;
  }

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-brand-text">Staff Members</h2>
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
                  {/* FIX: Property 'role' does not exist on type 'Staff'. Changed to 'email'. */}
                  <span className="text-sm text-brand-text-secondary">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <PhoneIcon className="w-4 h-4 text-brand-text-secondary" />
                  {/* FIX: Property 'contactNumber' does not exist on type 'Staff'. Changed to 'phone'. */}
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
  );
};

export default StaffList;