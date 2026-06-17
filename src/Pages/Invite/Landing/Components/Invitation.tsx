import { useNavigate } from "react-router-dom";

const Invitation = ({ groupName, id }: { groupName: string; id: string }) => {
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("온클릭!!");
    console.log("id", id);
    return;
    // if (!nickname.trim()) return;

    // 나중에 Supabase 멤버 insert 로직이 여기에 들어갈 거야
    navigate(`/app/${id}`);
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
