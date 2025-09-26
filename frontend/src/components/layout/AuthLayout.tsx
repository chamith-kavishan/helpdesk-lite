"use client";

import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export const AuthLayout = () => {
  const { token, user, saveToken } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    saveToken(null);
    navigate("/login");
  };

  return (
    <section className="bg-adminBgColor w-full min-h-screen flex font-nunito px-5 md:px-10 pb-10">
      <div className="container mx-auto">
        <div className="rounded-none sticky z-[999999] bg-adminBgColor h-[80px] md:min-h-[120px] top-0 w-full py-3 flex flex-row justify-between items-center border-b border-gray-500">
          <div className="flex items-center justify-end md:justify-between w-full z-50">
            <div className="flex justify-between w-full items-center">
              <Link
                to="/"
                className="text-[#00A36C] text-lg md:text-2xl font-bold gap-3"
              >
                HelpDesk Lite
              </Link>

              <div className="flex items-center gap-2 md:gap-4 mt-2">
                <span className="text-white text-xs md:text-sm">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#5E1609] cursor-pointer text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="z-[50] bg-adminBgColor px-1">
          <Outlet />
        </div>
      </div>
    </section>
  );
};
