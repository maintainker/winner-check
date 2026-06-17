import { supabase } from "@Shared";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const location = useLocation();

  const redirectUrl = location.state?.redirect || "/invite";

  const handleSocialLogin = async (provider: "kakao" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}${redirectUrl}`,
        queryParams:
          provider === "kakao"
            ? {
                scopes: "account_email",
              }
            : undefined,
      },
    });

    if (error) {
      console.error(`${provider} 로그인 에러:`, error.message);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full px-6 bg-white">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold text-slate-950">간편 로그인</h1>
        <p className="text-sm text-slate-500">
          서비스 이용을 위해 로그인이 필요합니다.
        </p>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="w-full h-14 bg-[#FEE500] text-[#191919] font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            💛 카카오로 시작하기
          </button>

          {/* ⚪️ 구글 로그인 버튼 */}
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full h-14 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer"
          >
            🌐 Google로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
