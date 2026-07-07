import { useGroupMembers } from "@Shared/apis/useGroup";
import { useMutationCreateMatch } from "@Shared/apis/useMatch";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

interface ParticipantState {
  group_members: string;
  bet_point: number;
}

export default function MatchRegistrationTailwind() {
  const { groupId } = useParams();

  if (!groupId) {
    return (
      <div className="text-center p-10 text-gray-500">
        모임 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const { data: members = [], isLoading, isError } = useGroupMembers(groupId);
  const { mutate: createMatchMutate, isPending } = useMutationCreateMatch();

  const [teamA, setTeamA] = useState<ParticipantState[]>([
    { group_members: "", bet_point: 1 },
    { group_members: "", bet_point: 1 },
  ]);
  const [teamB, setTeamB] = useState<ParticipantState[]>([
    { group_members: "", bet_point: 1 },
    { group_members: "", bet_point: 1 },
  ]);

  const handleParticipantChange = (
    team: "A" | "B",
    index: number,
    field: keyof ParticipantState,
    value: any,
  ) => {
    const updateTeam = team === "A" ? [...teamA] : [...teamB];
    updateTeam[index] = { ...updateTeam[index], [field]: value };
    team === "A" ? setTeamA(updateTeam) : setTeamB(updateTeam);
  };

  const addMemberInput = (team: "A" | "B") => {
    if (team === "A") setTeamA([...teamA, { group_members: "", bet_point: 1 }]);
    else setTeamB([...teamB, { group_members: "", bet_point: 1 }]);
  };

  const handleSubmit = () => {
    const hasEmptySelection = [...teamA, ...teamB].some(
      (p) => !p.group_members,
    );
    if (hasEmptySelection) {
      alert("⚠️ 모든 칸의 멤버를 선택해주세요!");
      return;
    }

    const totalTeamAPoints = teamA.reduce((sum, p) => sum + p.bet_point, 0);
    const totalTeamBPoints = teamB.reduce((sum, p) => sum + p.bet_point, 0);

    if (totalTeamAPoints !== totalTeamBPoints) {
      alert(
        `❌ 포인트 불일치!\n\n승리 팀 총합: ${totalTeamAPoints}점\n패배 팀 총합: ${totalTeamBPoints}점\n\n양 팀의 걸린 포인트 합계가 같아야 합니다.`,
      );
      return;
    }

    const payload = {
      groupId,
      participants: [
        ...teamA.map((p) => ({
          groupMemberId: p.group_members,
          team: "A" as const,
          betPoint: p.bet_point,
          isWinner: true,
        })),
        ...teamB.map((p) => ({
          groupMemberId: p.group_members,
          team: "B" as const,
          betPoint: p.bet_point,
          isWinner: false,
        })),
      ],
    };

    createMatchMutate(payload, {
      onSuccess: () => {
        alert("🎉 매치가 성공적으로 등록되었습니다!");
        setTeamA([
          { group_members: "", bet_point: 1 },
          { group_members: "", bet_point: 1 },
        ]);
        setTeamB([
          { group_members: "", bet_point: 1 },
          { group_members: "", bet_point: 1 },
        ]);
      },
      onError: (err: any) => {
        alert(`❌ 저장 실패: ${err.message}`);
      },
    });
  };

  if (isLoading)
    return (
      <div className="text-center p-10 text-gray-500">멤버 목록 로딩 중...</div>
    );
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        멤버를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="flex flex-col items-center p-4 xs:p-5 gap-5 w-full box-border bg-gray-50 min-h-screen">
      {/* 승리 팀 영역 (A) */}
      <div className="w-full max-w-[450px] border border-gray-200 rounded-2xl p-4 xs:p-5 flex flex-col gap-3 bg-white shadow-sm box-border">
        <h3 className="m-0 text-center text-[#4285F4] text-lg xs:text-xl font-bold">
          승 (Winner)
        </h3>
        {teamA.map((p, i) => (
          <div
            key={`A-${i}`}
            className="flex items-center gap-1.5 xs:gap-3 w-full"
          >
            <select
              value={p.group_members}
              onChange={(e) =>
                handleParticipantChange("A", i, "group_members", e.target.value)
              }
              className="flex-1 min-w-0 h-[42px] px-1.5 xs:px-2.5 rounded-lg border border-gray-300 bg-white text-sm xs:text-base focus:outline-none focus:border-blue-500 truncation"
            >
              <option value="">멤버 선택</option>
              {[...members]
                .sort((a: any, b: any) => {
                  const aIsGuest = a.nickname === "게스트" ? 1 : 0;
                  const bIsGuest = b.nickname === "게스트" ? 1 : 0;
                  return bIsGuest - aIsGuest;
                })
                .map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.nickname}
                  </option>
                ))}
            </select>

            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min="1"
                max="3"
                value={p.bet_point}
                onChange={(e) =>
                  handleParticipantChange(
                    "A",
                    i,
                    "bet_point",
                    Number(e.target.value),
                  )
                }
                className="w-12 xs:w-[60px] h-10 rounded-lg border border-gray-300 text-center text-sm xs:text-base focus:outline-none focus:border-blue-500"
              />
              <span className="text-sm xs:text-base text-gray-600 font-medium">
                점
              </span>
            </div>
          </div>
        ))}
        <button
          onClick={() => addMemberInput("A")}
          className="bg-none border border-dashed border-gray-400 p-2.5 rounded-lg cursor-pointer text-gray-600 text-sm xs:text-[0.95rem] transition-all hover:bg-gray-50 hover:border-gray-600"
        >
          + 인원 추가
        </button>
      </div>

      {/* 패배 팀 영역 (B) */}
      <div className="w-full max-w-[450px] border border-gray-200 rounded-2xl p-4 xs:p-5 flex flex-col gap-3 bg-white shadow-sm box-border">
        <h3 className="m-0 text-center text-[#EA4335] text-lg xs:text-xl font-bold">
          패 (Loser)
        </h3>
        {teamB.map((p, i) => (
          <div
            key={`B-${i}`}
            className="flex items-center gap-1.5 xs:gap-3 w-full"
          >
            <select
              value={p.group_members}
              onChange={(e) =>
                handleParticipantChange("B", i, "group_members", e.target.value)
              }
              className="flex-1 min-w-0 h-[42px] px-1.5 xs:px-2.5 rounded-lg border border-gray-300 bg-white text-sm xs:text-base focus:outline-none focus:border-blue-500 truncation"
            >
              <option value="">멤버 선택</option>
              {[...members]
                .sort((a: any, b: any) => {
                  const aIsGuest = a.nickname === "게스트" ? 1 : 0;
                  const bIsGuest = b.nickname === "게스트" ? 1 : 0;
                  return bIsGuest - aIsGuest;
                })
                .map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.nickname}
                  </option>
                ))}
            </select>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min="1"
                max="3"
                value={p.bet_point}
                onChange={(e) =>
                  handleParticipantChange(
                    "B",
                    i,
                    "bet_point",
                    Number(e.target.value),
                  )
                }
                className="w-12 xs:w-[60px] h-10 rounded-lg border border-gray-300 text-center text-sm xs:text-base focus:outline-none focus:border-red-500"
              />
              <span className="text-sm xs:text-base text-gray-600 font-medium">
                점
              </span>
            </div>
          </div>
        ))}
        <button
          onClick={() => addMemberInput("B")}
          className="bg-none border border-dashed border-gray-400 p-2.5 rounded-lg cursor-pointer text-gray-600 text-sm xs:text-[0.95rem] transition-all hover:bg-gray-50 hover:border-gray-600"
        >
          + 인원 추가
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className={`w-full max-w-[450px] h-12 xs:h-14 text-white border-none rounded-xl text-base xs:text-lg font-bold transition-colors ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#1a1a1a] cursor-pointer hover:bg-gray-800"
        }`}
      >
        {isPending ? "기록 중..." : "완료"}
      </button>
    </div>
  );
}
