import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "@/lib/api";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminList from "./AdminList";
import AdminEditor from "./AdminEditor";
import AdminMedia from "./AdminMedia";
import AdminCategories from "./AdminCategories";

// Token bo'lmasa — login sahifasiga.
function RequireAuth({ children }) {
  return auth.isAuthed() ? children : <Navigate to="/admin/login" replace />;
}

// /admin/* — barcha admin sahifalari (App.jsx'da lazy yuklanadi).
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route index element={<RequireAuth><AdminDashboard /></RequireAuth>} />
      <Route path="articles" element={<RequireAuth><AdminList /></RequireAuth>} />
      <Route path="articles/new" element={<RequireAuth><AdminEditor /></RequireAuth>} />
      <Route path="articles/:id/edit" element={<RequireAuth><AdminEditor /></RequireAuth>} />
      <Route path="media" element={<RequireAuth><AdminMedia /></RequireAuth>} />
      <Route path="categories" element={<RequireAuth><AdminCategories /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
