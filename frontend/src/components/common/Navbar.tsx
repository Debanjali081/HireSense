import React, { useState, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorElUser) {
      setAnchorElUser(null);
    } else {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pages = user
    ? [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Resumes", path: "/resumes" },
        { title: "Interviews", path: "/interviews" },
      ]
    : [];

  const settings = user
    ? [
        {
          title: "Profile",
          action: () => {
            navigate("/profile");
          },
          icon: "👤",
        },
        { title: "Logout", action: handleLogout, icon: "🚪" },
      ]
    : [];

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-orange-100 shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <RouterLink
              to={user ? "/" : "/login"}
              className="flex items-center group"
            >
              <div className="w-40 h-40 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="HireSense Logo"
                  className="w-full h-full object-contain z-50"
                />
              </div>

              {/* Removed the HireSense text as per user request */}
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {pages.map((page) => (
                <RouterLink
                  key={page.title}
                  to={page.path}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActivePage(page.path)
                      ? "bg-white/20 text-orange-500 shadow-lg backdrop-blur-sm border border-white/30"
                      : "text-blue-900 hover:bg-white/10 hover:text-orange-600"
                  }`}
                >
                  {page.title}
                </RouterLink>
              ))}
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={handleOpenUserMenu}
                  className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-white transition-all duration-200 border border-white/20 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center  font-bold mr-2 shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="mr-2 font-medium max-w-32 truncate text-orange-500">
                    {user.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform duration-200 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {anchorElUser && (
                  <div ref={menuRef} className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                    {settings.map((setting) => (
                      <button
                        key={setting.title}
                        onClick={setting.action}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <span className="mr-3 text-lg">{setting.icon}</span>
                        {setting.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <RouterLink
                  to="/login"
                  className="text-blue-100 hover:text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all duration-200"
                >
                  Login
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </RouterLink>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <div className="md:hidden ml-3">
                <button
                  onClick={handleOpenNavMenu}
                  className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && anchorElNav && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-xl">
            <div className="px-4 py-3 space-y-1">
              {pages.map((page) => (
                <RouterLink
                  key={page.title}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActivePage(page.path)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page.title}
                </RouterLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
