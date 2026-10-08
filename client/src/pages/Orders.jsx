import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import orderService from "../services/orderService";
import { ShoppingBag, Clock, ArrowRight, CheckCircle2, Package, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      if (data && data.orders) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
        return "badge-primary text-white";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 space-y-6">
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-base-content">
              <Clock className="w-6 h-6 text-primary" />
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Track and review your recent purchases and delivery progress.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link to="/products" className="btn btn-primary btn-sm flex items-center gap-1.5 font-semibold">
              <ShoppingBag className="w-4 h-4" />
              Shop More
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/60 mt-3">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm p-12 text-center rounded-2xl space-y-4">
            <Package className="w-12 h-12 mx-auto opacity-30 text-primary" />
            <h3 className="font-bold text-lg text-base-content">No Orders Placed Yet</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              You haven't placed any orders yet. Check out our catalog and find the products you love!
            </p>
            <Link to="/products" className="btn btn-primary btn-sm inline-flex items-center gap-2 mt-2">
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              const totalItemsCount = order.items?.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              );

              return (
                <div
                  key={order._id}
                  className="card bg-base-100 border border-base-300 shadow-sm p-6 rounded-2xl space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-base-200 gap-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-primary">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-base-content/50 ml-3">{orderDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${getStatusBadge(order.status)} badge-sm font-semibold`}>
                        {order.status || "Pending"}
                      </span>
                      <span className="font-extrabold text-base text-base-content">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order items list */}
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                          <span className="font-medium text-base-content">{item.product_name}</span>
                          <span className="text-base-content/50">(&times;{item.quantity || 1})</span>
                        </div>
                        <span className="font-bold text-base-content">
                          ${Number(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-base-content/60">
                    <p>
                      <strong className="text-base-content">Shipping To:</strong>{" "}
                      {order.shippingAddress || user?.address || "Delivery Address"}
                    </p>
                    <span className="font-medium text-base-content/50">
                      Total: {totalItemsCount} item(s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
