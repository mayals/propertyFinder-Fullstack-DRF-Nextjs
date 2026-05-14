// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from "../lib/axios";

interface RequestUserProfileData {

    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;

    gender?: string;
    profile_picture?: string;
    phone_number?: string | null;
    country?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
}

interface AuthContextType {
  user: RequestUserProfileData | null;
  setUser: (user: RequestUserProfileData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
  fetchUser: async () => {},
});






export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
      const [user, setUser] = useState<RequestUserProfileData | null>(null);
      const [loading, setLoading] = useState(true);

      // Function to fetch user profile (call explicitly after login)
      const fetchUser = async () => {
          try {
              const res = await axiosInstance.get(`/users/request-user-profile/`, {
                  withCredentials: true,
              });
              console.log('RequestUserProfileData-res.data=', res.data);
              setUser(res.data);
          } catch (err: any) {
              console.log('RequestUserProfileData-error=', err);
              // 401 or 404 means not logged in
              if (err.response?.status === 401 || err.response?.status === 404) {
                  console.log('User not authenticated');
              }
              setUser(null);
          } finally {
              setLoading(false);
          }
      };

      // Only fetch on initial load if we might have a session
      useEffect(() => {
          const hasCookie = typeof document !== 'undefined' &&
              (document.cookie.includes('sessionid') ||
               document.cookie.includes('csrftoken'));

          if (hasCookie) {
              fetchUser();
          } else {
              setLoading(false);
          }
      }, []);

      return (
          <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
              {children}
          </AuthContext.Provider>
      );
};
