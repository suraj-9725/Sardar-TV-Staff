import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Staff } from '../types';
import { FIRESTORE_COLLECTIONS } from '../constants';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, FIRESTORE_COLLECTIONS.STAFF), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const staffData: Staff[] = [];
      querySnapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() } as Staff);
      });
      setStaff(staffData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching staff:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { staff, loading, error };
}