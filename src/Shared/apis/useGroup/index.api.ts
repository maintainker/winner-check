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
}

export const getGroupMembers = async (
  groupId: string,
): Promise<GroupMemberResponse[]> => {
  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      nickname
    `,
    )
    .eq("group_id", groupId);
  console.log(data);
  if (error) {
    throw error;
  }

  // 💡 Supabase에서 나온 중첩 객체 데이터를 프론트에서 쓰기 좋게 평평하게(Flat) 가공합니다.
  return (data || []).map((member: any) => ({
    id: member.id,
    nickname: member.nickname,
  }));
};
