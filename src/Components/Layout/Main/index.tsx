import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigator from "./Navigator";
import { useGroup } from "@Shared/apis/useGroup";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLoadingStore } from "@Shared/stores";

export const MainLayout = () => {
  const { id } = useParams();
  const { data, isLoading } = useGroup(id!);
  const { showLoading, hideLoading } = useLoadingStore.getState();
  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, id]);

  return (
    <>
      <Header title={data?.title || ""} />
      <Outlet />
      <Navigator />
    </>
  );
};
