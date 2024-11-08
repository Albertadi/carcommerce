"use client";

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../authorization/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, permissions } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { access_token } = response.data;
      if (response.data.success) {
        login(access_token);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (permissions) {
      if (permissions.sub.has_admin_permission) {
        router.push('/pages/admin/dashboard');
      } else if (permissions.sub.has_listing_permission) {
        router.push('/pages/agent/dashboard');
      } else if (permissions.sub.has_sell_permission) {
        router.push('/pages/seller/dashboard');
      } else if (permissions.sub.has_buy_permission) {
        router.push('/pages/buyer/dashboard');
      } else {
        setError('Invalid permissions. Please contact IT administrator.');
      }
    }
  }, [permissions, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e2e2ef]">
      <div className="w-full max-w-[440px] p-8">
        <div className="bg-white rounded shadow-lg overflow-hidden relative">

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-[#f75049] text-4xl font-rajdhaniBold mb-2 text-center tracking-tight">
              LOGIN
            </h2>
            <p className="text-gray-400 font-rajdhaniSemiBold text-center mb-8 text-md">
              Enter your credentials to continue
            </p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[#f75049] text-sm font-rajdhaniBold pl-1">
                  EMAIL
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="enter email"
                    className="w-full px-4 py-3.5 bg-gray-50/50 font-rajdhaniSemiBold text-gray-700 border-2 border-transparent rounded
                             focus:outline-none focus:border-[#f75049] focus:bg-white
                             transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[#f75049] text-sm font-rajdhaniBold pl-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="enter password"
                    className="w-full px-4 py-3.5 bg-gray-50/50 font-rajdhaniSemiBold text-gray-700 border-2 border-transparent rounded
                             focus:outline-none focus:border-[#f75049] focus:bg-white
                             transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border-l-4 border-[#f75049] p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-[#f75049]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-[#f75049]">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#f75049] text-white rounded font-rajdhaniBold
                         hover:bg-[#5ef6ff]
                         focus:outline-none focus:ring-2 focus:ring-[#f75049] focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-rajdhaniSemiBold text-lg shadow-md"
              >
                {isLoading ? (
                  <div className="flex items-center font-rajdhaniSemiBold justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'LOGIN'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Development Message */}
        <div className="mt-6 text-center">
          <p className="text-[#f75049]/60 text-sm font-medium">
            THIS PAGE IS UNDER DEVELOPMENT
          </p>
        </div>
      </div>
    </div>
  );
}