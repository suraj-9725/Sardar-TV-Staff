import { Timestamp } from 'firebase/firestore';
// Fix: Import User type from firebase/compat/app
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Fix: Corrected AppUser type to firebase.User for compat library to resolve "no exported member 'User'" error.
export type AppUser = firebase.User;

export enum DeliveryStatus {
  NEW = 'New',
  ON_DELIVERY = 'On Delivery',
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
}

export type Branch = 'Nikol' | 'Sardar Patel Chowk';

export interface Delivery {
  id: string;
  productName: string;
  customerName: string;
  address: string;
  status: DeliveryStatus;
  createdAt: Timestamp;
  branch: Branch;
  notes?: string;
  assignedTo?: string;
  staffName?: string;
  productImage?: string;
  lastUpdatedBy?: string;
  updatedAt?: Timestamp;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  // Fix: Added 'role' property to fix "Property 'role' does not exist on type 'Staff'" error in StaffList.tsx.
  role: string;
}
