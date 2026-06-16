import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigator from "./Navigator";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Navigator />
    </>
  );
};
