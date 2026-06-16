import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout, Root } from "./Components";
import * as Pages from "./Pages";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Root>
        <Routes>
          <Route path="/" element={<Pages.Main />} />

          <Route path="invite" element={<div>초대에러페이지</div>} />
          <Route path="invite/:id" element={<div>초대페이지</div>} />

          <Route path="app/:id" element={<MainLayout />}>
            <Route index element={<div>메인페이지</div>} />
            <Route path="search" element={<div>검색페이지</div>} />
            <Route path="winner" element={<div>당첨페이지</div>} />
          </Route>
          <Route path="*" element={<div>404 페이지</div>} />
        </Routes>
      </Root>
    </BrowserRouter>
  </StrictMode>,
);
