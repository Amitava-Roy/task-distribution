import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./auth/Login";
import RegisterPage from "./auth/Register";
import DashboardLayout from "./dashboard/Dashboardlayout";
import Agents from "./dashboard/Agents";
import Tasks from "./dashboard/Tasks";

export default function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="agents" element={<Agents />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
