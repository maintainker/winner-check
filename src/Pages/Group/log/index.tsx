import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface MatchLog {
  id: string;
  playedAt: string; // 게임 날짜 (YYYY-MM-DD HH:mm)
  totalParticipants: number; // 총 참여 인원
  pointsExchanged: number; // 해당 판에 움직인 총 포인트 (선택)
}
const generateMockData = (): MatchLog[] => {
  const logs: MatchLog[] = [];
  const participantsPool = [4, 5, 6, 8];

  // 7월 1일부터 7월 6일까지 하루에 여러 게임이 진행된 시나리오
  for (let i = 1; i <= 60; i++) {
    // 1일부터 6일 사이로 고르게 분포시킴
    const day = Math.min(6, Math.floor((i - 1) / 10) + 1);
    const hour = 12 + (i % 8);
    const minute = (i * 5) % 60;

    // 날짜 문자열 포맷팅 (YYYY-MM-DD HH:mm)
    const dateStr = `2026-07-${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    const participants = participantsPool[i % participantsPool.length];

    logs.push({
      id: String(i),
      playedAt: dateStr,
      totalParticipants: participants,
      pointsExchanged: participants * 10,
    });
  }

  // 최신 게임이 맨 위로 오도록 날짜 내림차순 정렬
  return logs.sort((a, b) => b.playedAt.localeCompare(a.playedAt));
};

const MOCK_MATCH_LOGS = generateMockData();
const MatchHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [matchLogs] = useState<MatchLog[]>(MOCK_MATCH_LOGS);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 💡 1. 이번 달 데이터만 필터링하기
  const thisMonthLogs = matchLogs.filter((log) => {
    const logDate = new Date(log.playedAt);
    return (
      logDate.getFullYear() === currentYear &&
      logDate.getMonth() + 1 === currentMonth
    );
  });

  // 날짜 포맷팅 함수
  const formatDetailDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]}요일) ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleMatchClick = (matchId: string) => {
    console.log(`클릭된 매치 ID: ${matchId}`);
  };

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="flex flex-col w-full max-w-[675px] bg-white p-4 pt-0 box-border mx-auto relative">
        {/* 상단 타이틀 세션 */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {currentYear}년 {currentMonth}월 게임 로그
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            이번 달에 진행된 총 전적입니다.
          </p>
        </div>

        {/* 스크롤 영역 */}
        <div
          className=" overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {thisMonthLogs.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-sm">
              이번 달에 진행된 게임 기록이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {thisMonthLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleMatchClick(log.id)}
                  className="flex justify-between items-center px-5 py-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-gray-400 active:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-gray-800">
                      {formatDetailDate(log.playedAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                        총 {log.totalParticipants}명 참여
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="text-xs font-medium text-gray-400 mr-1">
                      상세보기
                    </span>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchHistoryPage;
