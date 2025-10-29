
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-primary flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
};

export default App;
