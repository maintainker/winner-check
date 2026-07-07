import {
  useGroupMembers,
  useMutationKickMember,
  useMutationUpdateMemberRole,
} from "@Shared/apis/useGroup";
import React from "react";
import { useParams, useOutletContext } from "react-router-dom";

const MembersPage: React.FC = () => {
  const { groupId } = useParams();

  const { myMembership } = useOutletContext<{
    myMembership: {
      role: "admin" | "member" | "owner" | "guest";
    } | null;
  }>();
  const { mutate: updateRoleMutate } = useMutationUpdateMemberRole(groupId!);
  const { mutate: kickMemberMutate } = useMutationKickMember(groupId!);

  const isAdmin =
    myMembership?.role === "admin" || myMembership?.role === "owner";

  const { data: members = [], isLoading, isError } = useGroupMembers(groupId!);

  const ROLE_PRIORITY: Record<string, number> = {
    owner: 1,
    admin: 2,
    member: 3,
  };

  const displayMembers = React.useMemo(() => {
    return [...members]
      .filter((member) => member.role?.toLowerCase() !== "guest")
      .sort((a, b) => {
        const roleA = a.role?.toLowerCase() || "member";
        const roleB = b.role?.toLowerCase() || "member";

        if (ROLE_PRIORITY[roleA] !== ROLE_PRIORITY[roleB]) {
          return ROLE_PRIORITY[roleA] - ROLE_PRIORITY[roleB];
        }

        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      });
  }, [members]);

  const handleRoleChange = (
    memberId: string,
    currentRole: "owner" | "admin" | "member" | "guest",
  ) => {
    if (currentRole === "owner") {
      alert("모임장은 권한을 변경할 수 없습니다.");
      return;
    }

    const nextRole = currentRole === "member" ? "admin" : "member";
    const confirmMessage =
      nextRole === "admin"
        ? "해당 멤버를 운영진으로 임명하시겠습니까?"
        : "해당 운영진을 일반 멤버로 강등하시겠습니까?";

    if (!window.confirm(confirmMessage)) return;

    updateRoleMutate(
      { memberId, nextRole },
      {
        onSuccess: () => {
          alert(`🎉 성공적으로 권한이 변경되었습니다.`);
        },
        onError: (err: any) => {
          alert(`❌ 권한 변경 실패: ${err.message}`);
        },
      },
    );
  };

  const handleKickMember = (
    memberId: string,
    nickname: string,
    role: string,
  ) => {
    if (role === "owner" || role === "admin") {
      alert(
        "모임장이나 운영진은 바로 추방할 수 없습니다. 일반 멤버로 강등 후 진행해 주세요.",
      );
      return;
    }

    if (
      !window.confirm(`정말로 [${nickname}] 멤버를 크루에서 추방하시겠습니까?`)
    )
      return;

    kickMemberMutate(memberId, {
      onSuccess: () => {
        alert(`👋 [${nickname}] 님이 크루에서 성공적으로 추방되었습니다.`);
      },
      onError: (err: any) => {
        alert(`❌ 추방 실패: ${err.message}`);
      },
    });
  };

  const getRoleBadge = (role: "owner" | "admin" | "member" | "guest") => {
    switch (role?.toLowerCase()) {
      case "owner":
        return (
          <span className="text-[11px] px-2 py-0.5 bg-red-50 text-red-600 font-bold rounded-md">
            모임장
          </span>
        );
      case "admin":
        return (
          <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 font-bold rounded-md">
            운영진
          </span>
        );
      default:
        return (
          <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-md">
            멤버
          </span>
        );
    }
  };

  return (
    <div className="w-full flex justify-center bg-gray-50 min-h-screen">
      <div className="flex flex-col w-full max-w-[675px] bg-white p-5 pt-4 box-border mx-auto relative shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              멤버 목록 및 관리
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              우리 모임의 총 인원은 {isLoading ? "-" : displayMembers.length}
              명입니다.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-12 text-sm animate-pulse">
            멤버 목록을 불러오는 중...
          </div>
        ) : isError ? (
          <div className="text-center text-red-400 py-12 text-sm">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : displayMembers.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-sm">
            등록된 멤버가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col pb-[20px] gap-3 overflow-y-auto max-h-[calc(100vh-160px)] [&::-webkit-scrollbar]:hidden">
            {displayMembers.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center px-4 py-3.5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm">
                    {member.nickname?.[0] || "?"}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-base">
                        {member.nickname}
                      </span>
                      {getRoleBadge(member.role as any)}
                    </div>
                    <span className="text-xs text-gray-400">
                      가입일: {member.joinedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isAdmin && member.role !== "owner" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleRoleChange(member.id, member.role as any)
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 active:scale-95 border border-gray-200 rounded-lg transition-all cursor-pointer"
                        title="권한 변경"
                      >
                        {member.role === "admin" ? "강등" : "임명"}
                      </button>

                      <button
                        onClick={() =>
                          handleKickMember(
                            member.id,
                            member.nickname,
                            member.role,
                          )
                        }
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 rounded-lg transition-all cursor-pointer"
                        title="크루원 추방"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-14v4M1 7h22M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
