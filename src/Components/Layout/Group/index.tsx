import { useMyGroupMembership } from "@Shared/apis/useMember";
import { Outlet, useParams, useNavigate } from "react-router-dom"; // 💡 useNavigate 추가
import { useEffect, useState } from "react";
import { supabase } from "@Shared";

const GroupLayout = () => {
  const { groupId } = useParams();
  const navigate = useNavigate(); // 💡 선언
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user?.id || null);
      setAuthLoading(false);
    };
    getSession();
  }, []);

  const { data: myMembership, isLoading: checkLoading } = useMyGroupMembership(
    groupId || "",
    currentUserId,
  );

  useEffect(() => {
    if (!authLoading && !checkLoading) {
      if (!myMembership || !groupId) {
        alert("해당 그룹의 멤버만 접근할 수 있습니다.");
        navigate("/invite", { replace: true });
      }
    }
  }, [authLoading, checkLoading, myMembership, groupId, navigate]);

  if (authLoading || checkLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-gray-500">
        로그인 중...
      </div>
    );
  }
  if (!myMembership || !groupId) {
    return null;
  }

  return (
    <>
      <Outlet context={{ myMembership }} />
    </>
  );
};

export default GroupLayout;
