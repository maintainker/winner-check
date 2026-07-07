import { useQuery } from "@tanstack/react-query";
import { getMyGroupMembership } from "./index.api";

export const useMyGroupMembership = (
  groupId: string,
  userId: string | null,
) => {
  return useQuery({
    queryKey: ["group-membership", groupId, userId],
    queryFn: () => getMyGroupMembership(groupId, userId!),
    enabled: !!groupId && !!userId, // 💡 두 ID가 모두 존재할 때만 딱 실행
  });
};
