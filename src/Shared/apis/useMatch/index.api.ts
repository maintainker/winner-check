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
