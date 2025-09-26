"use client";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Header() {
  const { token, saveToken, user } = useAuth();
  const nav = useNavigate();

  const logout = () => {
    saveToken(null);
    nav("/login");
  };

  return (
    <header className="app-header">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline hover:no-underline"
          >
            <div className="h-5 w-5 rounded bg-primary" />
            <span className="font-semibold tracking-tight text-foreground">
              Tickets
            </span>
          </Link>

          {token && (
            <nav className="hidden items-center gap-1 sm:flex">
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
              <Link to="/ticket/create" className="nav-link">
                New Ticket
              </Link>
            </nav>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <div className="text-sm text-foreground">{user.email}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <span className="text-xs font-semibold text-secondary-foreground">
                  {user.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {!token ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          ) : (
            <button onClick={logout} className="btn btn-outline">
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
