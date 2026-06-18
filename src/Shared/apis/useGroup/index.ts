import { useQuery } from "@tanstack/react-query";
import { fetchGroupInfo } from "./index.api";

export const useGroup = (groupId: string) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupInfo(groupId),
    enabled: !!groupId,

    staleTime: 1000 * 60 * 5,
  });
};
