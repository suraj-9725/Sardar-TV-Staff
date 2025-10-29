import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  await addDoc(collection(db, FIRESTORE_COLLECTIONS.DELIVERIES), {
    ...deliveryData,
    status: DeliveryStatus.NEW,
    createdAt: serverTimestamp(),
  });
};

export const updateDeliveryStatus = async (deliveryId: string, status: DeliveryStatus, userEmail: string | null) => {
  const deliveryRef = doc(db, FIRESTORE_COLLECTIONS.DELIVERIES, deliveryId);
  await updateDoc(deliveryRef, { 
    status,
    lastUpdatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
};

interface UpdateDeliveryData {
  productName: string;
  customerName: string;
  address: string;
  notes?: string;
}

export const updateDeliveryDetails = async (deliveryId: string, deliveryData: UpdateDeliveryData, userEmail: string | null) => {
  const deliveryRef = doc(db, FIRESTORE_COLLECTIONS.DELIVERIES, deliveryId);
  await updateDoc(deliveryRef, {
    ...deliveryData,
    lastUpdatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDelivery = async (deliveryId: string) => {
  const deliveryRef = doc(db, FIRESTORE_COLLECTIONS.DELIVERIES, deliveryId);
  await deleteDoc(deliveryRef);
};