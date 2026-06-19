import type { ReactNode } from "react";
import { Modal } from "@Components";

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-[675px] w-full h-screen overflow-y-scroll overflow-x-hidden mx-auto bg-white">
      <Modal />
      {children}
    </div>
  );
};

export default Root;
