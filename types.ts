import { Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export type AppUser = User;

export enum DeliveryStatus {
  NEW = 'New',
  ON_DELIVERY = 'On Delivery',
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
}

export type Branch = 'Sardar Patel Chowk' | 'Nikol';

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
}