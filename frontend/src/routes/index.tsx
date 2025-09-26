import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import TicketsList from "../pages/tickets/TicketsList";
import Login from "../pages/auth/Login";
import CreateTicket from "../pages/tickets/CreateTicket";
import TicketDetails from "../pages/tickets/TicketDetails";
import Register from "../pages/auth/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <TicketsList />,
      },
      {
        path: "/ticket/create",
        element: <CreateTicket />,
      },
      {
        path: "/ticket/:id",
        element: <TicketDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
