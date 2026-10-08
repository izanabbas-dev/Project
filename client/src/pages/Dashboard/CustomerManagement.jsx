import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import userService from "../../services/userService";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function CustomerManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      if (data && data.users) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-base-content">
              <Users className="w-6 h-6 text-primary" />
              Customer Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              View registered users, roles, contact numbers, and delivery addresses.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
            <div className="text-xs text-base-content/60 font-medium">
              Registered Accounts: <span className="font-bold text-primary">{users.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-3 font-medium">
                Loading user accounts...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-base-content/60">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
              <p className="font-semibold text-base">No customer accounts found</p>
              <p className="text-xs mt-1">New user signups will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs font-bold text-base-content/70">
                    <th className="w-16">#</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Contact Info</th>
                    <th>Address</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => (
                    <tr key={u._id} className="hover:bg-base-200/40">
                      <td className="font-mono text-xs text-base-content/50">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary/10 text-primary rounded-full w-9 h-9 flex items-center justify-center font-bold text-xs uppercase">
                              {u.name?.charAt(0) || "U"}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-sm capitalize text-base-content">
                              {u.name}
                            </div>
                            <div className="text-xs text-base-content/50 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm font-semibold capitalize ${
                            u.role === "admin"
                              ? "badge-primary text-white"
                              : "badge-outline border-base-content/30"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <ShieldCheck className="w-3 h-3 mr-1 inline" />
                          ) : (
                            <UserCheck className="w-3 h-3 mr-1 inline" />
                          )}
                          {u.role}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/70">
                        <div className="flex flex-col gap-0.5">
                          {u.cellphone_no && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-base-content/40" />
                              {u.cellphone_no}
                            </span>
                          )}
                          {u.workphone_no && !u.cellphone_no && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-base-content/40" />
                              {u.workphone_no}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-xs text-base-content/70 max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-base-content/40 shrink-0" />
                          <span className="truncate">{u.address || "N/A"}</span>
                        </div>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
