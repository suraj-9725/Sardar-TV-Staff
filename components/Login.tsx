
import React, { useState } from 'react';
// Fix: Removed v9 'signInWithEmailAndPassword' import
import { auth } from '../services/firebase';
import { BoxIcon } from './icons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Fix: Use signInWithEmailAndPassword method from auth instance
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary p-4">
      <div className="max-w-md w-full bg-brand-secondary rounded-xl shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <img src="https://www.sardartvpvtltd.com/wp-content/uploads/2025/02/SARDAR-TV-LOGO-1980x929.png" className="w-22 h-12 text-brand-blue mb-2" />
          <h2 className="text-3xl font-extrabold text-center text-brand-text">Login Page</h2>
          <p className="text-center text-brand-text-secondary">Sardar TV Delivery information</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-brand-accent bg-brand-accent placeholder-gray-500 text-brand-text focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-brand-accent bg-brand-accent placeholder-gray-500 text-brand-text focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-brand-red text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-blue disabled:bg-brand-accent"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;