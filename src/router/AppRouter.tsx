import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authState";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import PasswordRecoveryPage from "../pages/auth/PasswordRecoveryPage";
import ProfilePage from "../pages/auth/ProfilePage";
import SabanaPage from "../pages/sabana/SabanaPage";
import HomePage from "../pages/HomePage";
import FacultiesPage from "../pages/faculties/FacultiesPage";
import HeadquartersPage from "../pages/headquarters/HeadquartersPage";
import ProgramsPage from "../pages/programs/ProgramsPage";
import UsersPage from "../pages/users/UsersPage";
import MateriasPage from "../pages/materias/MateriasPage";
import HorariosPage from "../pages/horarios/HorariosPage";
import CronogramaPage from "../pages/horarios/CronogramaPage";
import GenerarHorariosPage from "../pages/horarios/GenerarHorariosPage";
import MatriculaPage from "../pages/matricula/MatriculaPage";
import PeriodoMatriculaPage from "../pages/matricula/PeriodoMatriculaPage";
import AvisosPage from "../pages/avisos/AvisosPage";

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
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="usuarios" element={<RoleRoute path="/dashboard/usuarios"><UsersPage /></RoleRoute>} />
        <Route path="programas" element={<RoleRoute path="/dashboard/programas"><ProgramsPage /></RoleRoute>} />
        <Route path="facultades" element={<RoleRoute path="/dashboard/facultades"><FacultiesPage /></RoleRoute>} />
        <Route path="sedes" element={<RoleRoute path="/dashboard/sedes"><HeadquartersPage /></RoleRoute>} />
        <Route path="horarios" element={<RoleRoute path="/dashboard/horarios"><HorariosPage /></RoleRoute>} />
        <Route path="cronograma" element={<RoleRoute path="/dashboard/cronograma"><CronogramaPage /></RoleRoute>} />
        <Route path="horarios/generar" element={<RoleRoute path="/dashboard/horarios"><GenerarHorariosPage /></RoleRoute>} />
        <Route path="matricula" element={<RoleRoute path="/dashboard/matricula"><MatriculaPage /></RoleRoute>} />
        <Route path="matricula/periodos" element={<RoleRoute path="/dashboard/matricula"><PeriodoMatriculaPage /></RoleRoute>} />
        <Route path="materias" element={<RoleRoute path="/dashboard/materias"><MateriasPage /></RoleRoute>} />
        <Route path="avisos" element={<RoleRoute path="/dashboard/avisos"><AvisosPage /></RoleRoute>} />
        <Route path="auditoria" element={<Navigate to="/dashboard" replace />} />
        <Route path="sabana" element={<RoleRoute path="/dashboard/sabana"><SabanaPage /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;