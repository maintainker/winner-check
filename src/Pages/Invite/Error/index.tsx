import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InviteError = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(3);
  useEffect(() => {
    if (time === 0) {
      navigate(-1);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      잘못된 초대코드입니다. {time}초후 이전 페이지로 이동합니다
    </div>
  );
};

export default InviteError;
