import { createContext, useContext, useEffect, useState } from "react";

const ClerkContext = createContext();

const STORAGE_KEY = "clerks";

export const ClerkProvider = ({ children }) => {
  const [clerks, setClerks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clerks));
  }, [clerks]);

  const addClerk = (clerk) => {
    setClerks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...clerk,
      },
    ]);
  };

  const updateClerk = (id, updates) => {
    setClerks((prev) =>
      prev.map((clerk) =>
        clerk.id === id
          ? {
              ...clerk,
              ...updates,
            }
          : clerk,
      ),
    );
  };

  const deleteClerk = (id) => {
    setClerks((prev) => prev.filter((clerk) => clerk.id !== id));
  };

  const getClerkByUserId = (userId) =>
    clerks.find((clerk) => clerk.userId === userId);

  return (
    <ClerkContext.Provider
      value={{
        clerks,
        addClerk,
        updateClerk,
        deleteClerk,
        getClerkByUserId,
      }}
    >
      {children}
    </ClerkContext.Provider>
  );
};

export const useClerks = () => useContext(ClerkContext);
