import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface MatchLog {
  id: string;
  playedAt: string;
  totalParticipants: number;
  pointsExchanged: number;
}

const generateMockData = (): MatchLog[] => {
  const logs: MatchLog[] = [];
  const participantsPool = [4, 5, 6, 8];

  // 테스트를 위해 6월과 7월 데이터가 고루 섞이도록 목데이터 수정
  for (let i = 1; i <= 60; i++) {
    const month = i % 2 === 0 ? "07" : "06"; // 6월, 7월 반반 섞기
    const day = Math.min(28, Math.floor((i - 1) / 2) + 1);
    const hour = 12 + (i % 8);
    const minute = (i * 5) % 60;

    const dateStr = `2026-${month}-${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    const participants = participantsPool[i % participantsPool.length];

    logs.push({
      id: String(i),
      playedAt: dateStr,
      totalParticipants: participants,
      pointsExchanged: participants * 10,
    });
  }

  return logs.sort((a, b) => b.playedAt.localeCompare(a.playedAt));
};

const MOCK_MATCH_LOGS = generateMockData();

const MatchHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // 💡 1. Query Parameter 가져오기 (?date=YYYY-MM 형식)
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date"); // 예: "2026-07"

  // 기본값은 오늘 날짜 기준 연/월 설정
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;

  // Query Param 정보가 있으면 파싱하고, 없으면 현재 년/월 사용
  const targetYear = dateParam
    ? parseInt(dateParam.split("-")[0])
    : defaultYear;
  const targetMonth = dateParam
    ? parseInt(dateParam.split("-")[1])
    : defaultMonth;

  const [matchLogs] = useState<MatchLog[]>(MOCK_MATCH_LOGS);

  // 💡 2. 선택된 연/월 데이터로 필터링 변경
  const thisMonthLogs = matchLogs.filter((log) => {
    const logDate = new Date(log.playedAt);
    return (
      logDate.getFullYear() === targetYear &&
      logDate.getMonth() + 1 === targetMonth
    );
  });

  const formatDetailDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]}요일) ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleMatchClick = (matchId: string) => {
    console.log(`클릭된 매치 ID: ${matchId}`);
  };

  // 💡 나중에 모달에서 월을 선택했을 때 실행할 함수 예시
  const handleMonthChange = (year: number, month: number) => {
    const formattedMonth = month.toString().padStart(2, "0");
    setSearchParams({ date: `${year}-${formattedMonth}` });
  };

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="flex flex-col w-full max-w-[675px] bg-white p-4 pt-0 box-border mx-auto relative">
        {/* 상단 타이틀 세션 (버튼 배치 디자인 반영) */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {targetYear}년 {targetMonth}월 게임 로그
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              선택한 달에 진행된 총 전적입니다.
            </p>
          </div>

          {/* 💡 3. 다른 달 선택 모달 오픈 버튼 */}
          <button
            onClick={() => {
              console.log("월 선택 모달 오픈!");
              // 여기에 모달 open 상태 변경 로직 넣기 (예: setIsModalOpen(true))
              // 테스트용: 클릭하면 6월/7월 토글로 쿼리파라미터 변경되는지 확인 가능
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-lg border border-gray-200 transition-all"
          >
            이전 기록 보기
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div
          className="overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {thisMonthLogs.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-sm">
              {targetMonth}월에 진행된 게임 기록이 없습니다.
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
