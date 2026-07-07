import { supabase } from "@Shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Invitation = ({ groupName, id }: { groupName: string; id: string }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const loginFlag = searchParams.get("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState("");

  // console.log("login:", loginFlag);
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
      .eq("group_id", id) // URL에서 가져온 모임 ID (id)
      .eq("user_id", user.id)
      .single();
    // 로그인 되어 있고 이미 그룹에 있다면 바로 모임 페이지로 이동
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
      return;
    }
    const { error: insertError } = await supabase.from("group_members").insert([
      {
        group_id: id,
        user_id: user.id,
        nickname: nickname,
      },
    ]);
    // 그룹 멤버 추가 성공하면 모임 페이지로 이동
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

      <form onSubmit={handleLogin} className="w-full space-y-5">
        <button
          type="submit"
          className={`w-full h-14 rounded-xl text-base font-bold transition-all flex items-center justify-center cursor-pointer ${"bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"}`}
        >
          가입하고 입장하기
        </button>
      </form>
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
