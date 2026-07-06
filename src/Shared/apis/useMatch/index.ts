import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "./index.api";

export const useMutationCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. 실행할 비동기 생성 API 연결
    mutationFn: (payload: Parameters<typeof createMatch>[0]) =>
      createMatch(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      /*
      queryClient.invalidateQueries({ queryKey: ["monthly-stats"] });
      queryClient.invalidateQueries({ queryKey: ["group-members"] });
      */
      console.log("🔥 매치 생성 캐시 갱신 완료:", data);
    },

    onError: (error) => {
      console.error("❌ 매치 생성 뮤테이션 실패:", error);
    },
  });
};
