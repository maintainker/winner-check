import AdsenseBanner from "@Components/Adsence";
import { supabase } from "@Shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 💡 방금 만든 광고 컴포넌트 임포트 (경로는 프로젝트에 맞게 수정)

const Invitation = ({ groupName, id }: { groupName: string; id: string }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const loginFlag = searchParams.get("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (loginFlag) {
      setIsModalOpen(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login", {
        state: {
          redirectUrl: `/invite/${id}?login=true`,
        },
        replace: true,
      });
      return;
    }
    const { data: existingMember, error: checkError } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      navigate(`/app/${id}`);
      return;
    }
    setIsModalOpen(true);
    return;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    if (
      nickname === "게스트" ||
      nickname === "모임장" ||
      nickname === "운영진"
    ) {
      alert("불가능한 닉네임입니다.");
      setIsSubmitting(false); // 가입 실패 시 제출 상태 해제
      return;
    }
    const { error: insertError } = await supabase.from("group_members").insert([
      {
        group_id: id,
        user_id: user.id,
        nickname: nickname,
      },
    ]);

    if (!insertError) {
      navigate(`/app/${id}`);
      return;
    }
    console.log("insertError", insertError);
    setIsSubmitting(false);
    return;
  };

  return (
    <div className="flex flex-col justify-between h-full px-6 py-10 bg-white">
      <div className="space-y-3">
        <div className="text-4xl">✉️</div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-snug">
          모임 공간에 {groupName}
          <br />
          초대되었습니다.
        </h1>
      </div>

      {/* 💡 [광고 삽입] 타이틀과 가입 버튼 사이 빈 공간에 광고를 배치합니다 */}
      <div className="flex-1 flex items-center justify-center my-6">
        <AdsenseBanner />
      </div>

      {/* 하단 버튼 영역 */}
      <form onSubmit={handleLogin} className="w-full space-y-5">
        <button
          type="submit"
          className="w-full h-14 rounded-xl text-base font-bold transition-all flex items-center justify-center cursor-pointer bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
        >
          가입하고 입장하기
        </button>
      </form>

      {/* 닉네임 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[360px] bg-white rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              닉네임 설정
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              모임에서 사용할 닉네임을 입력해 주세요.
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900"
                autoFocus
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                >
                  {isSubmitting ? "입장 중..." : "확인"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitation;
