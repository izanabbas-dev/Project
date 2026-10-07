import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Header Banner */}
          <div className="bg-neutral text-neutral-content p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-base-100 text-neutral font-bold text-3xl flex items-center justify-center uppercase shadow-inner">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold capitalize">
                  {user?.name || "User"}
                </h1>
                <span
                  className={`badge ${
                    isAdmin ? "badge-primary" : "badge-secondary"
                  } badge-sm font-semibold capitalize`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-3 h-3 mr-1 inline" />
                  ) : (
                    <UserCheck className="w-3 h-3 mr-1 inline" />
                  )}
                  {user?.role || "Customer"}
                </span>
              </div>
              <p className="text-neutral-content/70 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-error btn-outline btn-sm flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Body Information */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-base-content mb-4 pb-2 border-b border-base-200">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Full Name
                  </div>
                  <div className="text-sm font-semibold text-base-content capitalize mt-0.5">
                    {user?.name || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Email Address
                  </div>
                  <div className="text-sm font-semibold text-base-content mt-0.5">
                    {user?.email || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Residential Address
                  </div>
                  <div className="text-sm font-semibold text-base-content capitalize mt-0.5">
                    {user?.address || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Date of Birth
                  </div>
                  <div className="text-sm font-semibold text-base-content mt-0.5">
                    {formatDate(user?.dob)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Work Phone Number
                  </div>
                  <div className="text-sm font-semibold text-base-content mt-0.5">
                    {user?.workphone_no || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-200/50 border border-base-200">
                <div className="p-2 rounded-lg bg-base-100 text-primary border border-base-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-base-content/60">
                    Cellphone Number
                  </div>
                  <div className="text-sm font-semibold text-base-content mt-0.5">
                    {user?.cellphone_no || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
