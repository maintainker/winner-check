import { supabase } from "@Shared";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Invitation from "./Components/Invitation";

const InviteLanding = () => {
  const { id } = useParams<{ id: string }>();
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (!id) return;

    getGroupName(id);
  }, []);

  const getGroupName = async (id: string) => {
    const { data, error } = await supabase
      .from("groups")
      .select("title")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[InviteLanding] Error fetching group name:", error);
      return;
    }

    setGroupName(data?.title || "");
  };
  if (groupName !== "") {
    return <Invitation groupName={groupName} id={id} />;
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      정보를 불러오는 중입니다.
    </div>
  );
};

export default InviteLanding;
