import React, { createContext, useState } from 'react';

// Create a context for election status
export const ElectionContext = createContext();

// Create a provider component
export const ElectionProvider = ({ children }) => {
  const [electionStarted, setElectionStarted] = useState(false);

  return (
    <ElectionContext.Provider value={{ electionStarted, setElectionStarted }}>
      {children}
    </ElectionContext.Provider>
  );
};