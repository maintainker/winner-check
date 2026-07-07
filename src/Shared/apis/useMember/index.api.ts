import { supabase } from "@Shared";

export const getMyGroupMembership = async (groupId: string, userId: string) => {
  if (!groupId || !userId) return null;

  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      nickname,
      role
    `,
    )
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle(); // 💡 데이터가 없어도 에러를 뱉지 않고 깔끔하게 null을 반환합니다.

  if (error) throw error;
  if (!data) return null;

  return {
    groupMemberId: data.id,
    nickname: data.nickname,
    role: data.role,
  };
};
