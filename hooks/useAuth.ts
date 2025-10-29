
import { useState, useEffect } from 'react';
// Fix: Removed incorrect 'onAuthStateChanged' and 'User' imports. Auth logic is now instance-based.
import { auth } from '../services/firebase';
import { AppUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix: Use the onAuthStateChanged method from the auth instance
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser as AppUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}