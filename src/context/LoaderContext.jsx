import { createContext, useContext, useState } from 'react';

const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
  const [loaderDone, setLoaderDone] = useState(false);
  return (
    <LoaderContext.Provider value={{ loaderDone, setLoaderDone }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
