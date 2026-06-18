import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Navigator from "./Navigator";

export const MainLayout = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <Outlet />
      <Navigator />
    </>
  );
};
