import React, { useState } from 'react';
import { addDelivery } from '../services/deliveryService';
import { ImageIcon, XIcon } from './icons';
import { Branch } from '../types';
import { BRANCH_OPTIONS } from '../constants';

interface NewDeliveryFormProps {
  onClose: () => void;
}

const NewDeliveryForm: React.FC<NewDeliveryFormProps> = ({ onClose }) => {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState<Branch>('Sardar Patel Chowk');
  const [notes, setNotes] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !customerName || !address) {
      setError("Product, Customer, and Address fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addDelivery({ productName, customerName, address, branch, notes, productImage });
      setProductName('');
      setCustomerName('');
      setAddress('');
      setBranch('Sardar Patel Chowk');
      setNotes('');
      setProductImage(null);
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      onClose(); // Close the modal on success
    } catch (err) {
      setError("Failed to add delivery. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg relative">
       <button
        onClick={onClose}
        className="absolute top-3 right-3 text-brand-text-secondary hover:text-brand-text transition-colors"
        aria-label="Close form"
      >
        <XIcon className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-brand-text">Add New Delivery</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue md:col-span-3"
            disabled={isLoading}
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">Delivery Branch</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2 bg-brand-accent p-3 rounded-md">
            {BRANCH_OPTIONS.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="radio"
                    name="branch"
                    value={option}
                    checked={branch === option}
                    onChange={() => setBranch(option)}
                    className="h-4 w-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                    disabled={isLoading}
                />
                <span className="text-brand-text">{option}</span>
                </label>
            ))}
            </div>
        </div>
        
        <textarea
            placeholder="Optional Notes (e.g., call upon arrival)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-brand-accent text-brand-text p-3 rounded-md border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
            rows={3}
            disabled={isLoading}
        />

        {productImage && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
            <img src={productImage} alt="Product Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setProductImage(null)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-colors"
              aria-label="Remove image"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && <p className="text-brand-red text-sm">{error}</p>}
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-brand-accent disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Delivery'}
          </button>
          <label htmlFor="image-upload" className="flex items-center bg-brand-accent hover:bg-opacity-80 text-brand-text-secondary font-bold py-3 px-6 rounded-lg transition duration-300 cursor-pointer">
            <ImageIcon className="w-5 h-5 mr-2" />
            <span>{productImage ? 'Change Image' : 'Add Image'}</span>
          </label>
          <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
        </div>
      </form>
    </div>
  );
};

export default NewDeliveryForm;