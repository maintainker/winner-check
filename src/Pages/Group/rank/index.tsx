import { useQueryMonthlyGroupStats } from "@Shared/apis/useMatch";
import React from "react";
import { useOutletContext, useParams } from "react-router-dom";

interface GroupLayoutContext {
  myMembership: {
    groupMemberId: string;
    nickname: string;
  } | null;
}

const CrewRankingPage: React.FC = () => {
  const { groupId } = useParams();
  const { myMembership } = useOutletContext<GroupLayoutContext>();

  const {
    data: rawRankingList = [],
    isLoading,
    isError,
  } = useQueryMonthlyGroupStats(groupId ?? "");

  const currentMemberId = myMembership?.groupMemberId;

  // 💡 [수정] 오직 'nickname'이 '게스트'인 사람만 필터링하고 순위를 새로 매깁니다.
  const rankingList = React.useMemo(() => {
    return [...rawRankingList]
      .filter((item) => item.nickname !== "게스트") // 롤 조건 없이 닉네임으로만 필터링
      .map((item, index) => ({
        ...item,
        rank: index + 1, // 중간 순위가 비지 않도록 1등부터 순서대로 재할당
      }));
  }, [rawRankingList]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-75px)]">
        통계를 불러오는 중...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-75px)] text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );

  // 게스트가 빠진 리스트에서 내 정보를 정확하게 찾습니다.
  const myStat = rankingList.find(
    (member) => member.groupMemberId === currentMemberId,
  );

  const myInfo = myStat
    ? {
        nickname: myStat.nickname,
        rank: myStat.rank,
        points: myStat.monthlyPoints,
        winRate: myStat.winRate,
        record: `${myStat.wins}승 ${myStat.losses}패`,
      }
    : null;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-[480px] h-[calc(100vh-75px)] bg-white p-4 pt-0 box-border mx-auto">
        {myInfo ? (
          <div className="flex items-center gap-5 pb-4 px-2 mb-5">
            <div className="w-[70px] h-[70px] rounded-full bg-gray-200 border border-gray-300 flex-shrink-0" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  {myInfo.nickname}
                </span>
                <span className="text-base text-gray-600">
                  ({myInfo.rank}등 · {myInfo.points}p)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {myInfo.winRate}% ({myInfo.record})
              </div>
              <div className="inline-block self-start text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600 mt-0.5">
                {currentYear}년 {currentMonth}월 시즌
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4 mb-5 text-gray-500 text-sm text-center">
            내 정보를 찾을 수 없습니다. (모임 미가입 등)
          </div>
        )}

        <div
          className="overflow-y-auto border-2 max-h-[calc(100vh-274px)] border-gray-800 rounded-xl py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* 💡 깔끔하게 필터링된 리스트를 뿌려줍니다. */}
          {rankingList.map((member) => (
            <div
              key={member.groupMemberId}
              className={`flex justify-between items-center px-4 py-3.5 border-b border-gray-100 last:border-b-0 ${
                member.groupMemberId === currentMemberId ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4 text-center">
                  {member.rank}
                </span>
                <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-gray-800">
                    {member.nickname}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {member.monthlyPoints} p
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-medium text-gray-700">
                  {member.winRate}%
                </span>
                <span className="text-[10px] text-gray-400">
                  {member.wins}승 {member.losses}패
                </span>
              </div>
            </div>
          ))}

          {rankingList.length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm w-full">
              이번 달 매치 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrewRankingPage;
