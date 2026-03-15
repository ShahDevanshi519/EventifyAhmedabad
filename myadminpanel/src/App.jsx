import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ViewUsers from "./pages/users/ViewUsers";
import ViewInquiry from "./pages/contact/ViewInquiry";
import AddEvent from "./pages/events/AddEvent";
import ViewEvents from "./pages/events/ViewEvents";
import ChangePassword from "./pages/settings/ChangePassword";
import ViewBooking from "./pages/booking/ViewBooking";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/settings/EditProfile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/adminresetpassword/:token" element={<ResetPassword/>}/>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="contact" element={<ViewInquiry />} />
          <Route path="events/add" element={<AddEvent />} />
          <Route path="events/view" element={<ViewEvents />} />
          <Route path="booking" element={<ViewBooking />}/>
          <Route path="settings/change-password" element={<ChangePassword />} />
          <Route path="settings/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;