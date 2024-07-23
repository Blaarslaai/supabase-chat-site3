import { createContext, useState, ReactNode } from "react";

// Create a context
export const GlobalContext = createContext<any>(null);

// Create a provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("HOME");
  const [userID, setUserID] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [profile, setProfile] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userID,
        setUserID,
        userAvatarUrl,
        setUserAvatarUrl,
        profile,
        setProfile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
