
import { useState, useEffect } from 'react';
// Fix: Removed v9 firestore imports
import { db } from '../services/firebase';
import { Delivery } from '../types';
import { FIRESTORE_COLLECTIONS } from '../constants';

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fix: Use v8/compat syntax for firestore query
    const q = db.collection(FIRESTORE_COLLECTIONS.DELIVERIES).orderBy('createdAt', 'desc');
    
    const unsubscribe = q.onSnapshot((querySnapshot) => {
      const deliveriesData: Delivery[] = [];
      querySnapshot.forEach((doc) => {
        deliveriesData.push({ id: doc.id, ...doc.data() } as Delivery);
      });
      setDeliveries(deliveriesData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching deliveries:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { deliveries, loading, error };
}