import { useSelector } from "react-redux";
import Head from "next/head";
import { RootState } from "@/redux/store";
import Settings from "@/components/setting";


const SettingPage = () => {

  const user = useSelector((state: RootState) => state.user);

  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>Witit - Setting</title>
      </Head>
      <Settings />
    </>
  );
};
export default SettingPage;
