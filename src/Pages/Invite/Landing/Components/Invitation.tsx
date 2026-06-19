import { supabase } from "@Shared";
import { useNavigate } from "react-router-dom";

const Invitation = ({ groupName, id }: { groupName: string; id: string }) => {
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    // 로그인 되어 있지 않다면 로그인 화면으로 이동
    if (!user) {
      //TODO: 모달 열어서 로그인 으로 이동시킬지 결정

      navigate("/login", {
        state: {
          redirect: `/invite/${id}`,
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

    // 로그인 되어 있다면 그룹에 멤버 추가
    // TODO: 모달 추가해서 닉네임 입력 받기

    const { error: insertError } = await supabase.from("group_members").insert([
      {
        group_id: id,
        user_id: user.id,
        nickname: "임시",
      },
    ]);
    // 그룹 멤버 추가 성공하면 모임 페이지로 이동
    if (!insertError) {
      navigate(`/app/${id}`);
      return;
    }
    console.log("insertError", insertError);
    return;
  };
  return (
    <div className="flex flex-col justify-between h-full px-6 py-10 bg-white">
      {/* 🔹 상단: 핵심 질문만 임팩트 있게 */}
      <div className="space-y-3">
        <div className="text-4xl">✉️</div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-snug">
          모임 공간에 {groupName}
          <br />
          초대되었습니다.
        </h1>
      </div>

      {/* 🔹 하단: 입력 폼 + 버튼 세트 */}
      <form onSubmit={handleJoin} className="w-full space-y-5">
        <button
          type="submit"
          className={`w-full h-14 rounded-xl text-base font-bold transition-all flex items-center justify-center cursor-pointer ${"bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"}`}
        >
          가입하고 입장하기
        </button>
      </form>
    </div>
  );
};
export default Invitation;
