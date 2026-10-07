import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Products",
      count: "Manage Catalog",
      description: "Inventory & stock items",
      icon: Package,
      path: "/admin/products",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Categories",
      count: "Catalog Structure",
      description: "Product categories & tags",
      icon: Layers,
      path: "/admin/categories",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Orders",
      count: "Sales & Invoices",
      description: "Customer transactions",
      icon: ShoppingBag,
      path: "/admin/orders",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Customers",
      count: "Registered Users",
      description: "User profiles & contacts",
      icon: Users,
      path: "/admin/customers",
      color: "text-info",
      bg: "bg-info/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Welcome back, <span className="capitalize">{user?.name || "Admin"}</span>!
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Here is an overview of your store operations and management modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/products"
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
            <Link
              to="/admin/categories"
              className="btn btn-outline btn-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Link>
          </div>
        </div>

        {/* Stats / Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="card bg-base-100 border border-base-300 shadow-sm rounded-xl p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Link
                    to={stat.path}
                    className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-primary"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <h3 className="text-sm font-semibold text-base-content/70">
                  {stat.title}
                </h3>
                <p className="text-base font-bold text-base-content mt-1">
                  {stat.count}
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-base font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Product Catalog
                </h2>
                <Link
                  to="/admin/products"
                  className="link link-primary text-xs font-semibold"
                >
                  Manage All &rarr;
                </Link>
              </div>
              <p className="text-xs text-base-content/60">
                Create new product listings, upload imagery, update stock prices, and assign categories.
              </p>
              <div className="mt-4 pt-4 border-t border-base-200 flex justify-end">
                <Link to="/admin/products" className="btn btn-primary btn-sm">
                  Go to Products
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-base font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-secondary" />
                  Category Management
                </h2>
                <Link
                  to="/admin/categories"
                  className="link link-secondary text-xs font-semibold"
                >
                  Manage All &rarr;
                </Link>
              </div>
              <p className="text-xs text-base-content/60">
                Organize your products into structured categories to provide an easy browsing experience for customers.
              </p>
              <div className="mt-4 pt-4 border-t border-base-200 flex justify-end">
                <Link to="/admin/categories" className="btn btn-secondary btn-sm">
                  Go to Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
