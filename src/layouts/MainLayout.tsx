import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-app text-gray-900 dark:text-white transition-colors duration-300">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default MainLayout;