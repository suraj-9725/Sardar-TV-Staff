
// Fix: Removed v9 auth and firestore imports
import { db, secondaryAuth } from './firebase';
import { FIRESTORE_COLLECTIONS } from '../constants';

interface NewStaffData {
  name: string;
  role: string;
  phone: string;
}

export const addStaffMember = async (staffData: Required<NewStaffData>) => {

  // Fix: Use v8/compat syntax for adding a document
  // Add staff details to Firestore
  await db.collection(FIRESTORE_COLLECTIONS.STAFF).add({
    name: staffData.name,
    role: staffData.role,
    phone: staffData.phone,
  });
};