/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout/Layout';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id?: string;
  email: string;
  username: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const backendUrl = process.env.BACKEND_URL;
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/user`, {
          withCredentials: true,
        });
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser(); 
  }, [isAuthenticated]);


  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${backendUrl}/api/login`, { email, password }, {
        withCredentials: true, 
      });
      setIsAuthenticated(true);
      console.log(res)
      if (res.status === 200)
      toast.success(res.data.message);
      navigate('/');
    } catch (error: any) {
        toast.error(error.response.data.error);
    }
};

// Function to handle signup
const signup = async (username: string, email: string, password: string) => {
    try {
        const res = await axios.post(`${backendUrl}/api/signup`, { username, email, password }, {
            withCredentials: true,
        });
        const newUser = res.data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        navigate('/login');
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/logout`, {}, {
        withCredentials: true,
      });
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return <Layout>
        <div className="min-h-screen flex justify-center items-center mx-auto text-white font-semibold text-2xl">
            Loading...
        </div>
        </Layout>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
