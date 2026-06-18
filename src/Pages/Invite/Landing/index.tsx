import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Invitation from "./Components/Invitation";
import { useGroup } from "@Shared/apis/useGroup";

const InviteLanding = () => {
  const { id } = useParams<{ id: string }>();
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, error } = useGroup(id!);
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error || !data) {
      console.error("[InviteLanding] Error fetching group name:", error);
      navigate("/invite", { replace: true });
      return;
    }
    setGroupName(data.title);
  }, [data, isLoading, error]);
  if (groupName !== "") {
    return <Invitation groupName={groupName} id={id!} />;
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      정보를 불러오는 중입니다.
    </div>
  );
};

export default InviteLanding;
