import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import * as Pages from "./Pages";
import * as Components from "@Components";
// import { MainLayout, Root } from "./Components";
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
        <Components.Root>
          <Routes>
            <Route path="/" element={<Pages.Main />} />

            <Route path="login" element={<Pages.Login />} />
            <Route path="invite" element={<Pages.InviteError />} />
            <Route path="invite/:id" element={<Pages.InviteLanding />} />

            <Route path="app" element={<Components.Layout.MainLayout />}>
              <Route
                path=":groupId"
                element={<Components.Layout.GroupLayout />}
              >
                <Route index element={<Pages.Group.Main />} />
                <Route path="rank" element={<Pages.Group.Rank />} />
                <Route path="log" element={<Pages.Group.Log />} />
                <Route path="winner" element={<div>당첨페이지</div>} />
                {/* <Route path="match"> */}
                <Route path="add" element={<Pages.Match.Add />} />
                {/* </Route> */}
              </Route>
            </Route>
            <Route path="*" element={<div>404 페이지</div>} />
          </Routes>
        </Components.Root>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
