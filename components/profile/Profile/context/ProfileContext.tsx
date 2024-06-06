import { createContext, useContext, useEffect, useState } from "react";

import { ReduxUser } from "@/types/user";

type ContextType = {
  currentUser: ReduxUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<ReduxUser | null>>;
};

const defaultContext: ContextType = {
  currentUser: null,
  setCurrentUser: () => {},
};

const Context = createContext<ContextType>(defaultContext);

function ProfileContext({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ReduxUser | null>(null);

  return (
    <Context.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default ProfileContext;
export const useProfileContext = () => useContext(Context);
