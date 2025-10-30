import React, { useState, useMemo } from 'react';
import Header from './Header';
import { useDeliveries } from '../hooks/useDeliveries';
import { useStaff } from '../hooks/useStaff';
import DeliveryItem from './DeliveryItem';
import Spinner from './Spinner';
import NewDeliveryForm from './NewDeliveryForm';
import StaffList from './StaffList';
import SearchBar from './SearchBar';
import { DeliveryStatus } from '../types';
import { DELIVERY_STATUS_OPTIONS } from '../constants';
import { PlusIcon } from './icons';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { deliveries, loading: deliveriesLoading, error: deliveriesError } = useDeliveries();
  const { staff, loading: staffLoading, error: staffError } = useStaff();
  
  const [view, setView] = useState<'deliveries' | 'staff'>('deliveries');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const loading = deliveriesLoading || staffLoading;
  const error = deliveriesError || staffError;

  const staffEmailToNameMap = useMemo(() => {
    return staff.reduce((acc, member) => {
      acc[member.email] = member.name;
      return acc;
    }, {} as { [email: string]: string });
  }, [staff]);

  const filteredDeliveries = useMemo(() => {
    let result = deliveries;

    // 1. Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(delivery => delivery.status === statusFilter);
    }

    // 2. Filter by date
    if (selectedDate) {
      result = result.filter(delivery => {
        if (!delivery.createdAt) return false;
        // The input date is 'YYYY-MM-DD'. We format the delivery's timestamp to match.
        const deliveryDate = delivery.createdAt.toDate().toISOString().split('T')[0];
        return deliveryDate === selectedDate;
      });
    }

    // 3. Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(delivery =>
        delivery.productName.toLowerCase().includes(lowercasedQuery) ||
        delivery.customerName.toLowerCase().includes(lowercasedQuery) ||
        delivery.address.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return result;
  }, [deliveries, searchQuery, statusFilter, selectedDate]);

  const getFilterButtonClasses = (status: DeliveryStatus | 'all') => {
    const baseClasses = 'py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200';
    if (statusFilter === status) {
      return `${baseClasses} bg-brand-blue text-white shadow`;
    }
    return `${baseClasses} bg-brand-secondary hover:bg-brand-accent text-brand-text-secondary`;
  };

  const renderContent = () => {
    if (view === 'staff') {
      return <StaffList />;
    }

    // Default to 'deliveries' view
    return (
      <>
        <h4 className="text-3xl font-bold mb-4 text-brand-text">Delivery Tracker</h4>

        <div className="bg-brand-secondary p-3 rounded-xl shadow-sm mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-brand-text-secondary mr-2 text-sm">Filter by status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={getFilterButtonClasses('all')}
            >
              All
            </button>
            {DELIVERY_STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={getFilterButtonClasses(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="border-t border-brand-accent/70 pt-3 flex flex-wrap items-center gap-3">
             <label htmlFor="date-filter" className="font-semibold text-brand-text-secondary text-sm">Filter by exact date:</label>
             <input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-brand-primary p-2 rounded-lg border border-brand-accent text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-sm font-semibold text-brand-blue hover:underline"
                >
                  Clear Date
                </button>
              )}
          </div>
        </div>

        <SearchBar
          placeholder="Search by product, customer, or address..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        {loading && <Spinner />}
        {error && <p className="text-center text-brand-red">Error loading data: {error.message}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <DeliveryItem key={delivery.id} delivery={delivery} staffMap={staffEmailToNameMap} />
              ))
            ) : (
              <div className="text-center bg-brand-secondary p-8 rounded-lg">
                <p className="text-brand-text-secondary text-lg">
                  {deliveries.length > 0 
                    ? 'No deliveries match your search or filter.' 
                    : 'No deliveries found. Add a new one to get started!'}
                </p>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-primary">
      <Header user={user} currentView={view} onViewChange={setView} />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      {view === 'deliveries' && (
        <>
          <button
            onClick={() => setIsFormVisible(true)}
            className="fixed bottom-8 right-8 bg-brand-blue hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-30 transition-transform hover:scale-110"
            aria-label="Add new delivery"
          >
            <PlusIcon className="w-8 h-8" />
          </button>

          {isFormVisible && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsFormVisible(false)}
              ></div>
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl p-4">
                <NewDeliveryForm onClose={() => setIsFormVisible(false)} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;