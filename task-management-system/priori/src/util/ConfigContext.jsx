import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const [serverUrl, setServerUrl] = useState('');
  const [appName, setAppName] = useState('');
  useEffect(() => {

    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error('Failed to load config');
        }
        const data = await response.json();
        setServerUrl(data.serverUrl);  // Update the server URL state
        setAppName(data.appName);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ serverUrl, appName }}>
      {children}
    </ConfigContext.Provider>
  );
};
