import React from "react";

// 내부 테스트를 위한 가상 데이터 인터페이스
interface MemberRanking {
  id: string;
  name: string;
  points: number;
  winRate: number;
}

const CrewRankingPage: React.FC = () => {
  const myInfo = {
    nickname: "닉네임",
    rank: 3,
    points: 10,
    winRate: 66,
    record: "18승 12패",
    year: 2026,
  };

  const rankingList: MemberRanking[] = [
    { id: "1", name: "설연화", points: 25, winRate: 88 },
    { id: "2", name: "강민재", points: 21, winRate: 20 },
    { id: "3", name: "소나", points: 19, winRate: 90 },
    { id: "4", name: "쿠마", points: 15, winRate: 50 },
    { id: "5", name: "플레이어5", points: 12, winRate: 45 },
    { id: "6", name: "플레이어6", points: 10, winRate: 30 },
    { id: "7", name: "플레이어7", points: 8, winRate: 25 },
  ];

  return (
    <div className="flex flex-col w-full max-w-[480px] h-[calc(100vh-56px)] bg-white p-4 box-border">
      {/* 1. 상단: 내 정보 및 전적 영역 */}
      <div className="flex items-center gap-5 py-4 px-2 mb-5">
        {/* 프로필 이미지 (원형) */}
        <div className="w-[70px] h-[70px] rounded-full bg-gray-200 border border-gray-300 flex-shrink-0" />

        {/* 내 정보 텍스트 */}
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
            {myInfo.year}년 시즌1
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto border-2 border-gray-800 rounded-xl py-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {rankingList.map((member, index) => (
          <div
            key={member.id}
            className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 last:border-b-0"
          >
            {/* 리스트 왼쪽: 등수, 프로필, 이름/포인트 */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-4 text-center">
                {index + 1}
              </span>
              <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-gray-800">
                  {member.name}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {member.points} p
                </span>
              </div>
            </div>

            {/* 리스트 오른쪽: 승률 */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">
                {member.winRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrewRankingPage;
