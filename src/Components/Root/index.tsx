import type { ReactNode } from "react";

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-[675px] w-full h-screen overflow-y-scroll overflow-x-hidden mx-auto bg-white">
      {children}
    </div>
  );
};

export default Root;
