// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useConfig } from '../util/ConfigContext';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { serverUrl } = useConfig();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverUrl) return;
    const validateSession = async () => {
      try {
        const response = await fetch(`${serverUrl}/me`, {
          credentials: 'include', // Send cookies with the request
        });
        if (response.ok) {
          const userData = await response.json();
          
          const roles = userData.role.replace(/[\[\]]/g, '').split(',');
          const user = {
            username: userData.email,            
            displayName: userData.displayName,
            role: roles[0]
          }
          
          setUser(user); // Populate user context
        } else {
          setUser(null);
          setLoading(false);
          if (
            window.location.pathname !== '/' &&
            window.location.pathname !== '/register'
          ) {
            window.location.href = '/';
          }
          return;
        }
      } catch (error) {
        console.error(`Session validation failed @ ${serverUrl}/me:`, error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [serverUrl]);

  const login = (userData) => {
    
    const roles = userData.role?.replace(/[\[\]]/g, '').split(',') || [];
    const normalizedUser = {
      username: userData.email,
      displayName: userData.displayName,
      role: roles[0]
    };
    setUser(normalizedUser);
    // localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
