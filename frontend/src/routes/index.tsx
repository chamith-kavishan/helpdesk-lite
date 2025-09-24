import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import TicketsList from "../pages/TicketsList";
import PrivateRoute from "../auth/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}

      <Route
        path="/"
        element={
          <PrivateRoute>
            <TicketsList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
