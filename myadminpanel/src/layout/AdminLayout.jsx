import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 p-8 bg-gradient-to-br from-white to-purple-50">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}