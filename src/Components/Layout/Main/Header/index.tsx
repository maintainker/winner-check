import { NAVIGATOR_LIST } from "./index.constants";
import { useLocation, matchPath, useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHideNavi = NAVIGATOR_LIST.some((path) =>
    matchPath(path, location.pathname),
  );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`flex ${!isHideNavi ? "justify-between" : "justify-center"} items-center px-[13px] mb-[20px] h-[50px] sticky top-0 z-10 bg-white`}
    >
      {!isHideNavi && (
        <button className="w-[50px]" onClick={handleBack}>
          Back
        </button>
      )}
      <h1 className="font-bold text-[24px]">{title}</h1>
      {!isHideNavi && <div className="w-[50px] h-[50px] "></div>}
    </div>
  );
};

export default Header;
