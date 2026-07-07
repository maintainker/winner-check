import LoadingModal from "./Loading";
import MonthSelectModal from "./SelectMonth";
const Modal = () => {
  return (
    <>
      <MonthSelectModal />
      <LoadingModal />
    </>
  );
};

export default Modal;
