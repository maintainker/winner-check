import { supabase } from "@Shared";
interface ParticipantPayload {
  groupMemberId: string;
  team: "A" | "B";
  betPoint: number;
  isWinner: boolean;
}
export const createMatch = async (payload: {
  groupId: string;
  participants: ParticipantPayload[];
}) => {
  const { data: matchData, error: matchError } = await supabase
    .from("matches")
    .insert({
      group_id: payload.groupId,
      played_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (matchError) {
    throw matchError;
  }
  const matchId = matchData.id;

  const participantsData = payload.participants.map((p) => {
    const pointChange = p.isWinner ? p.betPoint : -p.betPoint;

    return {
      match_id: matchId,
      group_members: p.groupMemberId,
      team: p.team,
      bet_point: p.betPoint,
      is_winner: p.isWinner,
      point_change: pointChange,
    };
  });
  const { data: participantsResult, error: participantsError } = await supabase
    .from("match_participants")
    .insert(participantsData)
    .select();

  if (participantsError) {
    await supabase.from("matches").delete().eq("id", matchId);
    throw participantsError;
  }
  return {
    matchId,
    participants: participantsResult,
  };
};
export interface MonthlyGroupStat {
  rank: number; // 💡 1. 인터페이스/타입 정의에 rank 추가
  groupMemberId: string;
  nickname: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  monthlyPoints: number;
}

export const getMonthlyGroupStats = async (
  groupId: string,
): Promise<MonthlyGroupStat[]> => {
  // 💡 RPC 함수 호출
  const { data, error } = await supabase.rpc("get_monthly_group_stats", {
    p_group_id: groupId,
  });

  if (error) {
    throw error;
  }

  // 데이터베이스 스네이크 케이스 결과를 프론트엔드 카멜 케이스로 매핑
  return (data || []).map((row: any) => ({
    rank: Number(row.rank), // 💡 2. DB에서 내려오는 스네이크 케이스 rank를 숫자로 변환해 매핑
    groupMemberId: row.group_member_id,
    nickname: row.nickname,
    totalMatches: Number(row.total_matches),
    wins: Number(row.wins),
    losses: Number(row.losses),
    winRate: Number(row.win_rate),
    monthlyPoints: Number(row.monthly_points),
  }));
};
