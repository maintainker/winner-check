import { Spinner } from "./Components";
import "./index.css";
import { useLoadingStore } from "@Shared/stores";

const LoadingModal = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="loading-backdrop">
      <div className="loading-content">
        <Spinner size={56} />
        <p>잠시만 기다려주세요...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
