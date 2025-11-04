import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import LocationPage from "./pages/LocationPage";
import "./index.css"; // ✅ Tailwind 스타일 적용
import StatusPage from "./pages/StatusPage"; // ✅ 추가
import MealRecordPage from "./pages/MealRecordPage";
import AiRecommendPage from "./pages/AiRecommendPage";

// 라우터 설정
const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/location", element: <LocationPage /> },
  { path: "/status", element: <StatusPage /> },
  { path: "/calendar", element: <MealRecordPage /> },
  { path: "/ai", element: <AiRecommendPage /> },
]);

// ReactDOM으로 App 렌더링
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);