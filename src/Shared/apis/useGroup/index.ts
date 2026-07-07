import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGroupInfo,
  getGroupMembers,
  kickMemberApi,
  updateMemberRoleApi,
} from "./index.api";

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

export const useMutationUpdateMemberRole = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemberRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
  });
};
export const useMutationKickMember = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kickMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
  });
};
