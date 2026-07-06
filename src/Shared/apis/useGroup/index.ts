import { useQuery } from "@tanstack/react-query";
import { fetchGroupInfo, getGroupMembers } from "./index.api";

export const useGroup = (groupId: string) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupInfo(groupId),
    enabled: !!groupId,

    staleTime: 1000 * 60 * 5,
  });
};

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });
};
