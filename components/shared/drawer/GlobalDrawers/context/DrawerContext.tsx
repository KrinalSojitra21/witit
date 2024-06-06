import { createContext, useContext, useState } from "react";

type ContextType = {
  reportOfferId: string | null;
  setReportOfferId: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContext: ContextType = {
  reportOfferId: null,
  setReportOfferId: () => {},
};

const Context = createContext<ContextType>(defaultContext);

function DrawerContext({ children }: { children: React.ReactNode }) {
  const [reportOfferId, setReportOfferId] = useState<string | null>(null);

  return (
    <Context.Provider
      value={{
        reportOfferId,
        setReportOfferId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default DrawerContext;
export const useDrawerContext = () => useContext(Context);
