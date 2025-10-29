// Fix: Removed v9 auth and firestore imports
import { db } from './firebase';
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

export const updateStaffMember = async (id: string, data: { name: string; role: string; phone: string; }) => {
  const staffRef = db.collection(FIRESTORE_COLLECTIONS.STAFF).doc(id);
  await staffRef.update(data);
};

export const deleteStaffMember = async (id: string) => {
  const staffRef = db.collection(FIRESTORE_COLLECTIONS.STAFF).doc(id);
  await staffRef.delete();
};