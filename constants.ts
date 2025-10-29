import { DeliveryStatus, Branch } from "./types";

export const FIRESTORE_COLLECTIONS = {
  DELIVERIES: 'deliveries',
  STAFF: 'staff',
};

export const DELIVERY_STATUS_OPTIONS = [
  DeliveryStatus.NEW,
  DeliveryStatus.ON_DELIVERY,
  DeliveryStatus.PENDING,
  DeliveryStatus.DELIVERED,
];

export const BRANCH_OPTIONS: Branch[] = ['Nikol', 'Sardar Patel Chowk'];
