import { useDeleteMatch } from "@Shared/apis/useMatch";
import { getMatchDetail } from "@Shared/apis/useMatch/index.api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface MatchDetailModalProps {
  isOpen: boolean;
  matchId: string | null;
  onClose: () => void;
  isAdmin?: boolean;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  isOpen,
  matchId,
  onClose,
  isAdmin = false,
}) => {
  const { groupId } = useParams();

  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: deleteMatch, isPending: isDeleting } = useDeleteMatch(
    groupId || "",
  );

  useEffect(() => {
    if (!isOpen || !matchId) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getMatchDetail(matchId);
        setParticipants(data);
      } catch (err) {
        console.error("상세보기 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, matchId]);
  const handleDeleteMatch = async () => {
    if (!matchId) return;
    if (
      !window.confirm(
        "정말로 이 매치 기록을 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없으며 참여자들의 포인트 점수에도 영향을 줄 수 있습니다.",
      )
    )
      return;

    deleteMatch(matchId, {
      onSuccess: () => {
        alert("매치 기록이 정상적으로 삭제되었습니다.");
        onClose();
      },
      onError: (err) => {
        console.error("매치 삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      },
    });
  };
  if (!isOpen) return null;

  // 승리자와 패배자 분리
  const winners = participants.filter((p) => p.is_winner);
  const losers = participants.filter((p) => !p.is_winner);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      {/* 배경 클릭 시 닫힘 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 바디 */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-base font-bold text-gray-900">경기 상세 결과</h3>

          <div className="flex items-center gap-1">
            {/* 💡 [핵심] 내가 운영진(isAdmin)일 때만 쓰레기통 모양 버튼이 등장합니다 */}
            {isAdmin && (
              <button
                onClick={handleDeleteMatch}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                title="매치 기록 삭제"
              >
                <svg
                  className="w-5 h-5"
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
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div
          className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading ? (
            <div className="text-center text-gray-400 py-12 text-sm animate-pulse">
              결과를 불러오는 중...
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm">
              참여자 데이터가 없습니다.
            </div>
          ) : (
            <>
              {/* 🏆 승리 팀 */}
              {winners.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-md">
                      WIN
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      승리
                    </span>
                  </div>
                  <div className="border border-amber-100 rounded-xl bg-amber-50/30 divide-y divide-amber-100/50">
                    {winners.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {p.group_members?.nickname}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {p.team}팀
                          </span>
                        </div>
                        <span className="font-bold text-blue-600">
                          +{p.point_change} P
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 💀 패배 팀 */}
              {losers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 font-bold rounded-md">
                      LOSE
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      패배
                    </span>
                  </div>
                  <div className="border border-gray-100 rounded-xl bg-white divide-y divide-gray-100">
                    {losers.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            {p.group_members?.nickname}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            {p.team}팀
                          </span>
                        </div>
                        <span className="font-bold text-red-500">
                          {p.point_change} P
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
