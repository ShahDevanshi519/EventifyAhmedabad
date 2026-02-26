import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ViewUsers from "./pages/users/ViewUsers";
import ViewInquiry from "./pages/contact/ViewInquiry";
import AddEvent from "./pages/events/AddEvent";
import ViewEvents from "./pages/events/ViewEvents";
import ChangePassword from "./pages/settings/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="contact" element={<ViewInquiry />} />
          <Route path="events/add" element={<AddEvent />} />
          <Route path="events/view" element={<ViewEvents />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;