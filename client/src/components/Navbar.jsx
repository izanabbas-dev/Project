import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import ThemeToggle from "./ThemeToggle";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Package,
  Phone,
  Home as HomeIcon,
  Menu,
  X,
  Clock,
  CheckCircle2,
} from "lucide-react";

function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { totalItems, toastMessage, setToastMessage } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-base-100 border-b border-base-300 shadow-xs transition-colors duration-200">
      {/* Toast Alert for Cart actions */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 animate-bounce">
          <div className="alert alert-success shadow-lg text-white py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 navbar min-h-16 flex justify-between items-center">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm btn-square md:hidden text-base-content"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-base-content hover:opacity-90 transition-opacity"
          >
            <div className="p-2 rounded-lg bg-primary text-primary-content shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight">E-Shop</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-primary text-primary-content shadow-xs"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/products")
                ? "bg-primary text-primary-content shadow-xs"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            Products
          </Link>

          <Link
            to="/contact"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/contact")
                ? "bg-primary text-primary-content shadow-xs"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            Contact
          </Link>

          {/* Logged in only: Orders */}
          {isAuthenticated && (
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/orders")
                  ? "bg-primary text-primary-content shadow-xs"
                  : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              Orders
            </Link>
          )}

          {/* Admin Dashboard */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith("/admin")
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Side: Theme Toggle, Cart & User Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="btn btn-ghost btn-circle btn-sm relative text-base-content hover:bg-base-200"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="badge badge-primary badge-xs absolute -top-1 -right-1 font-bold animate-pulse text-primary-content">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm flex items-center gap-2 border border-base-300 rounded-lg py-1 px-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold uppercase border border-primary/30">
                  {user?.name ? user.name.charAt(0) : "U"}
                </div>
                <div className="flex flex-col items-start text-left hidden lg:flex">
                  <span className="text-xs font-semibold capitalize leading-none text-base-content">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-base-content/60 capitalize mt-0.5">
                    {user?.role || "Customer"}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-xl border border-base-300 text-base-content"
              >
                <li className="menu-title px-3 py-1.5 border-b border-base-200 mb-1">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content capitalize">
                      {user?.name}
                    </span>
                    <span className="text-xs text-base-content/60 lowercase truncate">
                      {user?.email}
                    </span>
                  </div>
                </li>
                <li>
                  <Link to="/profile" className="flex items-center gap-2 py-2">
                    <User className="w-4 h-4 text-primary" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="flex items-center gap-2 py-2">
                    <Clock className="w-4 h-4 text-primary" />
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="flex items-center gap-2 py-2">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    Shopping Cart ({totalItems})
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 py-2 text-primary font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-error hover:bg-error/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm flex items-center gap-1.5 font-medium text-base-content"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm flex items-center gap-1.5 font-medium shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-base-200 bg-base-100 px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
              isActive("/")
                ? "bg-primary text-primary-content"
                : "text-base-content/80 hover:bg-base-200"
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
              isActive("/products")
                ? "bg-primary text-primary-content"
                : "text-base-content/80 hover:bg-base-200"
            }`}
          >
            <Package className="w-4 h-4" />
            Products
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
              isActive("/contact")
                ? "bg-primary text-primary-content"
                : "text-base-content/80 hover:bg-base-200"
            }`}
          >
            <Phone className="w-4 h-4" />
            Contact
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive("/orders")
                    ? "bg-primary text-primary-content"
                    : "text-base-content/80 hover:bg-base-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Orders
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive("/cart")
                    ? "bg-primary text-primary-content"
                    : "text-base-content/80 hover:bg-base-200"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({totalItems})
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive("/profile")
                    ? "bg-primary text-primary-content"
                    : "text-base-content/80 hover:bg-base-200"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
