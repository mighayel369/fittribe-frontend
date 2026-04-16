import { Routes, Route } from "react-router-dom";
import UserRoutes from "./router/UserRoutes";
import AdminRoutes from "./router/AdminRoutes";
import TrainerRoutes from "./router/TrainerRoutes";
import NotFoundPage from "./components/NotFound";
export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/trainer/*" element={<TrainerRoutes />} />

      <Route path="/*" element={<UserRoutes />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}