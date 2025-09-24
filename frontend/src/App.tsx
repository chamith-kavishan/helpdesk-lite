import AppRoutes from "./routes";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav className="p-4 border-b flex gap-4 fixed top-0 w-full">
        <Link to="/">Tickets</Link>
        <Link to="/create">Create Ticket</Link>
        <Link to="/login">Login</Link>
      </nav>
      <div className="p-4">
        <AppRoutes />
      </div>
    </div>
  );
}
