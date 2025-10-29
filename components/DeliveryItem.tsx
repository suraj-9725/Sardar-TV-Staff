import React, { useState, useRef, useEffect } from 'react';
import { Delivery, DeliveryStatus } from '../types';
import { DELIVERY_STATUS_OPTIONS } from '../constants';
import { updateDeliveryStatus, updateDeliveryDetails, deleteDelivery } from '../services/deliveryService';
import { auth } from '../services/firebase';
import { BoxIcon, XIcon, PencilIcon, TrashIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';

interface DeliveryItemProps {
  delivery: Delivery;
  staffMap: { [email: string]: string };
}

const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.NEW:
      return 'bg-blue-200 text-blue-800';
    case DeliveryStatus.ON_DELIVERY:
      return 'bg-yellow-200 text-yellow-800';
    case DeliveryStatus.PENDING:
      return 'bg-orange-200 text-orange-800';
    case DeliveryStatus.DELIVERED:
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const DeliveryItem: React.FC<DeliveryItemProps> = ({ delivery, staffMap }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<DeliveryStatus | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({
    productName: delivery.productName,
    customerName: delivery.customerName,
    address: delivery.address,
    notes: delivery.notes || '',
  });

  useEffect(() => {
    // If the delivery prop from parent changes, and we are not in edit mode,
    // update the local state for editing to ensure it's not stale.
    if (!isEditing) {
        setEditedData({
            productName: delivery.productName,
            customerName: delivery.customerName,
            address: delivery.address,
            notes: delivery.notes || '',
        });
    }
  }, [delivery, isEditing]);

  const handleStatusChangeRequest = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as DeliveryStatus;
    if (newStatus !== delivery.status) {
      setPendingStatus(newStatus);
      setIsConfirmModalOpen(true);
      if (selectRef.current) {
        selectRef.current.value = delivery.status;
      }
    }
  };

  const handleConfirmUpdate = async () => {
    if (!pendingStatus) return;
    const user = auth.currentUser;
    try {
      await updateDeliveryStatus(delivery.id, pendingStatus, user?.email || 'Unknown');
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    setPendingStatus(null);
  };
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const user = auth.currentUser;
    try {
      await updateDeliveryDetails(delivery.id, editedData, user?.email || 'Unknown');
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update delivery details:", error);
      alert("Failed to update details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // State will be reset by the useEffect hook
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDelivery(delivery.id);
      // Realtime listener will handle UI update
    } catch (error) {
      console.error("Failed to delete delivery:", error);
      alert("Failed to delete delivery. Please try again.");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString();
  }

  return (
    <>
      <div className="bg-brand-secondary p-4 rounded-lg shadow-md transition-all hover:shadow-lg flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-2 flex justify-center items-center pt-2">
            {delivery.productImage ? (
              <img
                src={delivery.productImage}
                alt={delivery.productName}
                className="w-24 h-24 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsImageModalOpen(true)}
              />
            ) : (
              <div className="w-24 h-24 bg-brand-accent flex items-center justify-center rounded-md">
                <BoxIcon className="w-10 h-10 text-brand-text-secondary" />
              </div>
            )}
          </div>
          
          <div className="md:col-span-4 space-y-2">
             {isEditing ? (
              <>
                <input
                  type="text"
                  name="productName"
                  value={editedData.productName}
                  onChange={handleEditInputChange}
                  placeholder="Product Name"
                  className="w-full bg-brand-accent text-brand-text p-2 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <input
                  type="text"
                  name="customerName"
                  value={editedData.customerName}
                  onChange={handleEditInputChange}
                  placeholder="Customer Name"
                  className="w-full bg-brand-accent text-brand-text p-2 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </>
            ) : (
              <>
                <p className="font-bold text-lg text-brand-text">{delivery.productName}</p>
                <p className="text-sm text-brand-text-secondary">{delivery.customerName}</p>
              </>
            )}
          </div>
          
          <div className="md:col-span-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="address"
                  value={editedData.address}
                  onChange={handleEditInputChange}
                  placeholder="Delivery Address"
                  className="w-full bg-brand-accent text-brand-text p-2 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <textarea
                  name="notes"
                  value={editedData.notes}
                  onChange={handleEditInputChange}
                  placeholder="Optional Notes"
                  className="w-full bg-brand-accent text-brand-text p-2 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <p className="text-sm text-brand-text-secondary">{delivery.address}</p>
                 <p className="mt-2 text-xs text-brand-text-secondary font-semibold bg-gray-100 px-2 py-1 rounded-full inline-block">
                  Branch: {delivery.branch}
                </p>
                {delivery.notes && (
                  <div className="mt-2 pt-2 border-t border-brand-accent/60">
                    <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Notes</p>
                    <p className="text-sm text-brand-text whitespace-pre-wrap">{delivery.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="md:col-span-2">
              {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleSaveEdit} 
                  disabled={isSaving}
                  className="bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300 w-full text-sm disabled:bg-brand-accent"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  className="bg-brand-accent hover:bg-gray-300 text-brand-text-secondary font-bold py-2 px-3 rounded-lg transition duration-300 w-full text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <select
                    key={delivery.status}
                    ref={selectRef}
                    defaultValue={delivery.status}
                    onChange={handleStatusChangeRequest}
                    className={`w-full p-2 rounded-md font-semibold text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-blue ${getStatusColor(delivery.status)}`}
                >
                    {DELIVERY_STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-brand-accent hover:bg-gray-300 text-brand-text-secondary rounded-lg transition duration-300"
                    aria-label="Edit delivery details"
                >
                    <PencilIcon className="w-5 h-5"/>
                </button>
                 <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="p-2 bg-brand-red hover:bg-red-700 text-white rounded-lg transition duration-300"
                    aria-label="Delete delivery"
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-brand-accent mt-4 pt-2 text-xs text-brand-text-secondary flex flex-wrap justify-between items-center gap-2">
          <span>Created: {formatDate(delivery.createdAt)}</span>
          {delivery.lastUpdatedBy && delivery.updatedAt && (
            <span className="text-right">
              Last Update: <strong>{staffMap[delivery.lastUpdatedBy] || delivery.lastUpdatedBy}</strong> ({formatDate(delivery.updatedAt)})
            </span>
          )}
        </div>
      </div>

      {pendingStatus && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmUpdate}
          title="Confirm Status Change"
          message={
            <p className="text-base">
              Are you sure you want to change the status to{' '}
              <strong className={`px-2 py-1 rounded-md inline-block text-sm font-semibold ${getStatusColor(pendingStatus)}`}>
                {pendingStatus}
              </strong>?
            </p>
          }
        />
      )}

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={
            <p className="text-base">
              Are you sure you want to delete the delivery for{' '}
              <strong>{delivery.productName}</strong> to <strong>{delivery.customerName}</strong>? This action cannot be undone.
            </p>
          }
          variant="danger"
        />
      )}

      {isImageModalOpen && delivery.productImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <img 
            src={delivery.productImage} 
            alt={delivery.productName} 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            aria-label="Close image view"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default DeliveryItem;