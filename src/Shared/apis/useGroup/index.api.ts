import { supabase } from "@Shared";

export const fetchGroupInfo = async (groupId: string) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export interface GroupMemberResponse {
  id: string;
  nickname: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}
export const getGroupMembers = async (
  groupId: string,
): Promise<GroupMemberResponse[]> => {
  if (!groupId) return [];

  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      nickname,
      role,
      joined_at
    `,
    )
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((member: any) => ({
    id: String(member.id),
    nickname: member.nickname,
    role: member.role?.toLowerCase() as "owner" | "admin" | "member",
    joinedAt: member.joined_at ? member.joined_at.split("T")[0] : "-",
  }));
};
