import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Layers,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
  ];

  const isNavActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const getCurrentPageTitle = () => {
    const current = navItems.find((item) => isNavActive(item));
    return current ? current.name : "Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-base-200/50 text-base-content transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-base-100 border-r border-base-300 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-base-200">
          <Link
            to="/admin"
            className="flex items-center gap-2.5 font-bold text-lg text-base-content"
          >
            <div className="p-2 rounded-lg bg-primary text-primary-content shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold">Admin Portal</span>
              <span className="text-[10px] font-medium text-base-content/50 uppercase tracking-wider">
                Control Center
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-ghost btn-sm btn-square lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-base-content/40">
            Store Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-base-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors"
          >
            <Store className="w-4 h-4 text-primary" />
            <span>View Public Store</span>
          </Link>

          <div className="p-2.5 rounded-xl bg-base-200/80 border border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 border border-primary/30">
                {user?.name ? user.name.charAt(0) : "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold capitalize truncate text-base-content">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-base-content/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-base-100 border-b border-base-300 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm btn-square lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/50 hidden sm:inline">
                Admin
              </span>
              <ChevronRight className="w-4 h-4 text-base-content/30 hidden sm:inline" />
              <h1 className="text-base sm:text-lg font-bold text-base-content">
                {getCurrentPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              to="/"
              className="btn btn-outline btn-sm hidden sm:flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              Live Store
            </Link>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-circle avatar placeholder"
              >
                <div className="bg-primary/20 text-primary border border-primary/30 rounded-full w-8 text-xs font-bold uppercase">
                  <span>{user?.name ? user.name.charAt(0) : "A"}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-base-300 text-base-content"
              >
                <li className="menu-title px-3 py-1 border-b border-base-200">
                  <span className="font-semibold capitalize text-base-content">
                    {user?.name}
                  </span>
                  <span className="text-xs text-base-content/60 lowercase">
                    {user?.email}
                  </span>
                </li>
                <li>
                  <Link to="/profile">Admin Profile</Link>
                </li>
                <li>
                  <Link to="/">Back to Store</Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
