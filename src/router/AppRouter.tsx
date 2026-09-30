import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authState";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import SabanaPage from "../pages/sabana/SabanaPage";
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

function RoleRoute({ children, path }: { children: ReactNode; path: string }) {
  const { canAccess } = useAuth();
  return canAccess(path) ? children : <Navigate to="/dashboard" replace />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<RoleRoute path="/dashboard/usuarios"><UsersPage /></RoleRoute>} />
        <Route path="programas" element={<ProgramsPage />} />
        <Route path="facultades" element={<RoleRoute path="/dashboard/facultades"><FacultiesPage /></RoleRoute>} />
        <Route path="sedes" element={<RoleRoute path="/dashboard/sedes"><HeadquartersPage /></RoleRoute>} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="materias" element={<MateriasPage />} />
        <Route path="avisos" element={<AvisosPage />} />
        <Route path="auditoria" element={<RoleRoute path="/dashboard/auditoria"><AuditoriaPage /></RoleRoute>} />
        <Route path="sabana" element={<RoleRoute path="/dashboard/sabana"><SabanaPage /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;