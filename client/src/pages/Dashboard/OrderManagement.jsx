import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import orderService from "../../services/orderService";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  X,
} from "lucide-react";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      if (data && data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || o.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge-success text-white";
      case "Shipped":
        return "badge-info text-white";
      case "Processing":
        return "badge-warning text-white";
      case "Cancelled":
        return "badge-error text-white";
      default:
        return "badge-ghost";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-base-content">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Order Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Track customer transactions, fulfillments, shipping, and order delivery statuses.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order ID or customer..."
                  className="input input-bordered input-sm w-full pl-9"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-sm bg-base-100 text-base-content"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="text-xs text-base-content/60 font-medium">
              Total Orders: <span className="font-bold text-primary">{orders.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-3 font-medium">
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-base-content/60">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
              <p className="font-semibold text-base">No orders placed yet</p>
              <p className="text-xs mt-1">Customer checkout transactions will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs font-bold text-base-content/70">
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-base-200/40">
                      <td className="font-mono text-xs font-bold text-primary">
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div className="font-semibold text-sm capitalize text-base-content">
                          {o.user?.name || "Guest Customer"}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {o.user?.email || "N/A"}
                        </div>
                      </td>
                      <td className="text-xs text-base-content/70">
                        {o.items?.length || 0} items
                      </td>
                      <td className="font-bold text-sm text-base-content">
                        ${Number(o.totalAmount || 0).toFixed(2)}
                      </td>
                      <td>
                        <select
                          value={o.status || "Pending"}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className={`badge ${getStatusBadge(
                            o.status
                          )} select select-xs font-semibold py-1 border-none bg-opacity-90`}
                        >
                          <option value="Pending" className="bg-base-100 text-base-content">Pending</option>
                          <option value="Processing" className="bg-base-100 text-base-content">Processing</option>
                          <option value="Shipped" className="bg-base-100 text-base-content">Shipped</option>
                          <option value="Delivered" className="bg-base-100 text-base-content">Delivered</option>
                          <option value="Cancelled" className="bg-base-100 text-base-content">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="text-right pr-6">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn btn-ghost btn-xs text-primary"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs">
          <div className="modal-box border border-base-300 max-w-lg bg-base-100 text-base-content">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg text-base-content">
                Order #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <div className="p-3 bg-base-200/80 rounded-xl space-y-1 text-xs">
                <p>
                  <span className="font-bold text-base-content">Customer:</span> {selectedOrder.user?.name} (
                  {selectedOrder.user?.email})
                </p>
                <p>
                  <span className="font-bold text-base-content">Shipping Address:</span>{" "}
                  {selectedOrder.shippingAddress || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base-content">Placed on:</span>{" "}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-2 text-base-content">Order Items:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg border border-base-200 text-xs"
                    >
                      <div className="font-medium text-base-content">
                        {item.product_name} &times; {item.quantity || 1}
                      </div>
                      <div className="font-bold text-primary">
                        ${Number(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-base-200">
                <span className="font-bold text-sm text-base-content">Total Amount:</span>
                <span className="font-extrabold text-lg text-primary">
                  ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="modal-action pt-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-primary btn-sm w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
