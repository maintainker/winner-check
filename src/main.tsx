import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import * as Pages from "./Pages";
import { MainLayout, Root } from "./Components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Root>
          <Routes>
            <Route path="/" element={<Pages.Main />} />

            <Route path="login" element={<Pages.Login />} />
            <Route path="invite" element={<Pages.InviteError />} />
            <Route path="invite/:id" element={<Pages.InviteLanding />} />

            <Route path="app/:id" element={<MainLayout />}>
              <Route index element={<div className="bg-red">메인페이지</div>} />
              <Route path="search" element={<div>검색페이지</div>} />
              <Route path="winner" element={<div>당첨페이지</div>} />
            </Route>
            <Route path="*" element={<div>404 페이지</div>} />
          </Routes>
        </Root>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
