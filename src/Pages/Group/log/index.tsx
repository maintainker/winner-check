import { useMonthSelectStore } from "@Shared/stores/selectMonth";
import { useSearchParams, useParams, useOutletContext } from "react-router-dom";
import { useGroupMatchHistory } from "@Shared/apis/useMatch"; // 💡 새로 만든 쿼리 훅 임포트
import MatchDetailModal from "@Components/Modal/DetailMatch";
import { useState } from "react";

interface MatchLog {
  id: string;
  played_at: string; // 💡 DB 필드명 스네이크 케이스 대응
  total_participants: number;
  points_exchanged: number;
}

const MatchHistoryPage: React.FC = () => {
  const { myMembership } = useOutletContext<{
    myMembership: {
      role: "admin" | "member" | "owner";
    } | null;
  }>();

  const { groupId } = useParams();

  const openMonthSelect = useMonthSelectStore((state) => state.openMonthSelect);
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get("date");

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;

  const targetYear = dateParam
    ? parseInt(dateParam.split("-")[0])
    : defaultYear;
  const targetMonth = dateParam
    ? parseInt(dateParam.split("-")[1])
    : defaultMonth;

  const { data: thisMonthLogs = [], isLoading } = useGroupMatchHistory(
    groupId!,
    targetYear,
    targetMonth,
  );

  const formatDetailDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]}요일) ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };
  const handleMatchClick = (matchId: string) => {
    setSelectedMatchId(matchId);
    setIsDetailOpen(true);
  };

  const handleMonthChange = (year: number, month: number) => {
    const formattedMonth = month.toString().padStart(2, "0");
    setSearchParams({ date: `${year}-${formattedMonth}` }, { replace: true });
  };

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="flex flex-col w-full max-w-[675px] bg-white p-4 pt-4 box-border mx-auto relative">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {targetYear}년 {targetMonth}월 게임 로그
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              선택한 달에 진행된 총 전적입니다.
            </p>
          </div>

          <button
            onClick={() => {
              const currentParamStr =
                dateParam ||
                `${targetYear}-${String(targetMonth).padStart(2, "0")}`;
              openMonthSelect(currentParamStr, handleMonthChange);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-lg border border-gray-200 transition-all cursor-pointer"
          >
            이전 기록 보기
          </button>
        </div>

        <div
          className="overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            <div className="text-center text-gray-400 py-20 text-sm animate-pulse">
              기록을 불러오는 중입니다...
            </div>
          ) : thisMonthLogs.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-sm">
              {targetMonth}월에 진행된 게임 기록이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {thisMonthLogs.map((log: any) => (
                <div
                  key={log.id}
                  onClick={() => handleMatchClick(log.id)}
                  className="flex justify-between items-center px-5 py-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-gray-400 active:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-gray-800">
                      {formatDetailDate(log.played_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                        총 {log.total_participants}명 참여
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
      <MatchDetailModal
        isAdmin={
          myMembership?.role === "admin" || myMembership?.role === "owner"
        }
        isOpen={isDetailOpen}
        matchId={selectedMatchId}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedMatchId(null);
        }}
      />
    </div>
  );
};

export default MatchHistoryPage;
