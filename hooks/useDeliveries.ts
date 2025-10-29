
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Delivery } from '../types';
import { FIRESTORE_COLLECTIONS } from '../constants';

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, FIRESTORE_COLLECTIONS.DELIVERIES), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
