import { useNavigate, useParams } from "react-router-dom";

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline font-medium hover:text-blue-700 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const GroupMain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const introductionText =
    "안녕하세요! 인천 티츄모임입니다. 함께 티츄하실 모두를 환영합니다!";
  const handleButtonClick = (menuName: string) => {
    if (menuName === "rank") {
      navigate(`rank`);
      return;
    }
    if (menuName === "log") {
      navigate(`log`);
      return;
    }

    alert(`${menuName} 페이지로 이동합니다.`);
  };
  const shadowButtonClasses =
    "bg-white rounded-2xl h-[200px] border border-gray-200/60 " +
    "shadow-sm " +
    "text-lg font-semibold text-gray-800 tracking-wide flex items-center justify-center text-center leading-snug " +
    "transition-all duration-150 " +
    "active:scale-[0.98] active:bg-gray-50/80";

  return (
    <div className="relative max-w-[675px] mx-auto p-5 min-h-[calc(100vh-100px)] bg-gray-50 flex flex-col box-border">
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="text-base leading-relaxed text-gray-800 mb-5 whitespace-pre-wrap break-all">
          {renderTextWithLinks(introductionText)}
        </div>

        <div className="flex items-center pt-4 border-t border-gray-100">
          <div className="w-11 height-11 w-[44px] h-[44px] rounded-full bg-gray-200 border border-gray-300 mr-3 flex-shrink-0" />

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-0.5">모임장</span>
            <span className="text-sm font-semibold text-gray-800">홍길동</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-auto pb-[70px]">
        <button
          onClick={() => handleButtonClick("rank")}
          className={shadowButtonClasses}
        >
          랭킹
        </button>
        <button
          onClick={() => handleButtonClick("사진첩")}
          className={shadowButtonClasses}
        >
          사진첩
        </button>
        <button
          onClick={() => handleButtonClick("log")}
          className={shadowButtonClasses}
        >
          전적
          <br />
          확인
        </button>
      </div>

      {/* 플로팅 버튼 (+) */}
      <button
        onClick={() => navigate("add")}
        className="fixed bottom-[30px] left-[calc(50%+337.5px)] -translate-x-[calc(100%+30px)] max-[675px]:left-auto max-[675px]:right-[24px] max-[675px]:translate-x-0 w-14 h-14 rounded-full bg-gray-800 text-white text-3xl font-light flex items-center justify-center transition-all shadow-xl shadow-gray-400/50 hover:bg-gray-700 active:scale-95 z-50"
      >
        +
      </button>
    </div>
  );
};

export default GroupMain;
