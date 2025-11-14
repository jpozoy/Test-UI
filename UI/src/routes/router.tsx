// src/routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import MainPage from "../pages/Main";      // primera pantalla
import BookDetails from "../pages/BookDetails"; // 👈 nueva importación

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> }, 
  { path: "/mainpage", element: <MainPage /> }, // primera pantalla
  { path: "/book/:id", element: <BookDetails /> }, 
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

