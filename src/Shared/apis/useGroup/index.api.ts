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
