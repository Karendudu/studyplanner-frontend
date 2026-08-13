import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import FacultiesPage from "../pages/faculties/FacultiesPage";
import HeadquartersPage from "../pages/headquarters/HeadquartersPage";
import ProgramsPage from "../pages/programs/ProgramsPage";
import UsersPage from "../pages/users/UsersPage";
import MateriasPage from "../pages/materias/MateriasPage";
import HorariosPage from "../pages/horarios/HorariosPage";
import AvisosPage from "../pages/avisos/AvisosPage";
import AuditoriaPage from "../pages/auditoria/AuditoriaPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="programas" element={<ProgramsPage />} />
        <Route path="facultades" element={<FacultiesPage />} />
        <Route path="sedes" element={<HeadquartersPage />} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="materias" element={<MateriasPage />} />
        <Route path="avisos" element={<AvisosPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default AppRouter;