import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserInfo } from "@/types/message";
import getGenerationSetting from "@/api/user/getGenerationSetting";
import { generationSettingsUnit } from "@/types/user";
import { useAuthContext } from "@/context/AuthContext";

type ContextType = {
  selectedUser: UserInfo | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  messageCredit: generationSettingsUnit | null;
  setMessageCredit: React.Dispatch<
    React.SetStateAction<generationSettingsUnit | null>
  >;
};

const defaultContext: ContextType = {
  selectedUser: null,
  setSelectedUser: () => {},
  messageCredit: null,
  setMessageCredit: () => {},
};

const Context = createContext<ContextType>(defaultContext);

function MessageContext({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [messageCredit, setMessageCredit] =
    useState<generationSettingsUnit | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const { sendNotification } = useAuthContext();

  const getMessageGenerationCredit = async () => {
    if (!selectedUser) {
      return <></>;
    }

    const response = await getGenerationSetting({
      creatorId: selectedUser.id,
      user_id: user?.userId,
    });

    if (response.status === 200) {
      setMessageCredit(response.data);
      return <></>;
    }

    sendNotification({ type: "ERROR", message: response.error });
  };
  useEffect(() => {
    getMessageGenerationCredit();
  }, []);

  return (
    <Context.Provider
      value={{
        selectedUser,
        setSelectedUser,
        messageCredit,
        setMessageCredit,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default MessageContext;
export const useMessageContext = () => useContext(Context);
