// Fix: Removed v9 firestore imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from './firebase';
import { FIRESTORE_COLLECTIONS } from '../constants';
import { DeliveryStatus, Branch } from '../types';

interface NewDeliveryData {
  productName: string;
  customerName: string;
  address: string;
  branch: Branch;
  notes?: string;
  productImage?: string | null;
}

export const addDelivery = async (deliveryData: NewDeliveryData) => {
  // Fix: Use v8/compat syntax for adding a document
  await db.collection(FIRESTORE_COLLECTIONS.DELIVERIES).add({
    ...deliveryData,
    status: DeliveryStatus.NEW,
    // Fix: Use v8/compat syntax for serverTimestamp
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const updateDeliveryStatus = async (deliveryId: string, status: DeliveryStatus, userEmail: string | null) => {
  // Fix: Use v8/compat syntax for updating a document
  const deliveryRef = db.collection(FIRESTORE_COLLECTIONS.DELIVERIES).doc(deliveryId);
  await deliveryRef.update({ 
    status,
    lastUpdatedBy: userEmail,
    // Fix: Use v8/compat syntax for serverTimestamp
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

interface UpdateDeliveryData {
  productName: string;
  customerName: string;
  address: string;
  notes?: string;
}

export const updateDeliveryDetails = async (deliveryId: string, deliveryData: UpdateDeliveryData, userEmail: string | null) => {
  // Fix: Use v8/compat syntax for updating a document
  const deliveryRef = db.collection(FIRESTORE_COLLECTIONS.DELIVERIES).doc(deliveryId);
  await deliveryRef.update({
    ...deliveryData,
    lastUpdatedBy: userEmail,
    // Fix: Use v8/compat syntax for serverTimestamp
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteDelivery = async (deliveryId: string) => {
  // Fix: Use v8/compat syntax for deleting a document
  const deliveryRef = db.collection(FIRESTORE_COLLECTIONS.DELIVERIES).doc(deliveryId);
  await deliveryRef.delete();
};