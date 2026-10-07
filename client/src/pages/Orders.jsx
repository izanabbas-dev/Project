import React from "react";
import Layout from "../components/Layout";
import { ShoppingBag, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Orders() {
  const { user } = useAuth();

  const mockOrders = [
    {
      id: "ORD-94812",
      date: "May 12, 2026",
      total: 149.99,
      status: "Delivered",
      itemsCount: 1,
      items: ["Wireless Noise Cancelling Headphones"],
    },
    {
      id: "ORD-93210",
      date: "April 28, 2026",
      total: 89.99,
      status: "Processing",
      itemsCount: 1,
      items: ["Minimalist Ergonomic Mechanical Keyboard"],
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 space-y-6">
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-base-content">
              <Clock className="w-6 h-6 text-primary" />
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Track and review your recent shopping history
            </p>
          </div>
          <Link to="/products" className="btn btn-primary btn-sm flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            Shop More
          </Link>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="card bg-base-100 border border-base-300 shadow-sm p-6 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-base-200 gap-2">
                <div>
                  <span className="font-bold text-sm text-base-content">{order.id}</span>
                  <span className="text-xs text-base-content/50 ml-3">{order.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`badge ${
                      order.status === "Delivered" ? "badge-success" : "badge-warning"
                    } badge-sm font-semibold`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-sm text-base-content">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-base-content/70">
                  <p className="font-medium text-base-content">{order.items.join(", ")}</p>
                  <p className="text-base-content/50 mt-0.5">{order.itemsCount} item(s)</p>
                </div>
                <button className="btn btn-ghost btn-xs border border-base-300">
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
