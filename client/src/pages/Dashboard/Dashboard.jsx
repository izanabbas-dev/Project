import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import statsService from "../../services/statsService";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Plus,
  RefreshCw,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentCategories, setRecentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try to fetch unified stats endpoint
      let statsData = null;
      try {
        const res = await statsService.getStats();
        if (res && res.stats) {
          statsData = res.stats;
        }
      } catch (err) {
        console.warn("Unified stats endpoint fallback:", err.message);
      }

      // 2. Fetch recent products and categories
      const [prodsRes, catsRes] = await Promise.all([
        productService.getAllProducts().catch(() => ({ products: [], productCount: 0 })),
        categoryService.getAllCategories().catch(() => ({ categories: [] })),
      ]);

      const prodsList = prodsRes?.products || (Array.isArray(prodsRes) ? prodsRes : []);
      const catsList = catsRes?.categories || (Array.isArray(catsRes) ? catsRes : []);

      setRecentProducts(prodsList.slice(0, 5));
      setRecentCategories(catsList.slice(0, 6));

      if (statsData) {
        setStats(statsData);
      } else {
        setStats({
          products: prodsRes?.productCount || prodsList.length,
          categories: catsList.length,
          users: 1,
          orders: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load some dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      count: stats.products,
      description: "Active catalog inventory items",
      icon: Package,
      path: "/admin/products",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
      actionText: "Manage Products",
    },
    {
      title: "Total Categories",
      count: stats.categories,
      description: "Active store taxonomy tags",
      icon: Layers,
      path: "/admin/categories",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
      actionText: "Manage Categories",
    },
    {
      title: "Registered Users",
      count: stats.users,
      description: "Active customer accounts",
      icon: Users,
      path: "/admin/customers",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/40",
      actionText: "View Customers",
    },
    {
      title: "Total Orders",
      count: stats.orders,
      description: "Customer sales & transactions",
      icon: ShoppingBag,
      path: "/admin/orders",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
      actionText: "Track Orders",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              Live Store Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              Welcome back, <span className="capitalize text-primary">{user?.name || "Admin"}</span>!
            </h1>
            <p className="text-sm text-base-content/60 mt-1 max-w-xl">
              Here is your live eCommerce store overview. Monitor inventory counts, category structures, user signups, and transaction metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-2"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              to="/admin/products"
              className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
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

        {error && (
          <div className="alert alert-warning text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button onClick={fetchDashboardData} className="btn btn-xs btn-ghost underline">
              Retry
            </button>
          </div>
        )}

        {/* Live Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`card bg-base-100 border border-base-300 shadow-sm rounded-2xl p-6 transition-all duration-200 hover:shadow-md ${stat.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Link
                    to={stat.path}
                    className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-primary hover:bg-base-200"
                    title={stat.actionText}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                    {stat.title}
                  </span>
                  {loading ? (
                    <div className="h-9 w-20 bg-base-200 animate-pulse rounded-lg mt-1"></div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-base-content tracking-tight">
                        {stat.count}
                      </p>
                      <span className="badge badge-xs badge-ghost text-base-content/60">
                        Live
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-base-content/50 mt-1">
                    {stat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-base-200/60 flex items-center justify-between">
                  <Link
                    to={stat.path}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {stat.actionText} &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Overview Breakdown: Recent Products & Quick Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products Column (2 cols) */}
          <div className="lg:col-span-2 card bg-base-100 border border-base-300 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-base-content">
                    Recently Added Products
                  </h2>
                  <p className="text-xs text-base-content/50">
                    Latest inventory items in catalog
                  </p>
                </div>
              </div>
              <Link
                to="/admin/products"
                className="btn btn-ghost btn-xs text-primary font-semibold"
              >
                View All Products &rarr;
              </Link>
            </div>

            <div className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="p-8 text-center text-base-content/60">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary" />
                  <p className="text-sm font-medium">No products in catalog yet</p>
                  <Link
                    to="/admin/products"
                    className="btn btn-primary btn-xs mt-3"
                  >
                    Create Product
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-compact w-full">
                    <thead>
                      <tr className="bg-base-200/40 text-xs text-base-content/60">
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((item) => (
                        <tr key={item._id} className="hover:bg-base-200/30">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-9 h-9 rounded-lg bg-base-200 overflow-hidden border border-base-300">
                                  {item.product_image ? (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <Package className="w-4 h-4 m-auto text-base-content/40" />
                                  )}
                                </div>
                              </div>
                              <span className="font-semibold text-xs text-base-content line-clamp-1">
                                {item.product_name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-sm badge-outline text-xs capitalize">
                              {typeof item.category === "object"
                                ? item.category?.category_name
                                : "General"}
                            </span>
                          </td>
                          <td className="font-bold text-xs text-base-content">
                            ${Number(item.price).toFixed(2)}
                          </td>
                          <td className="text-right">
                            <Link
                              to="/admin/products"
                              className="btn btn-ghost btn-xs text-primary"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Categories Column (1 col) */}
          <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-base-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-base-content">
                      Store Categories
                    </h2>
                    <p className="text-xs text-base-content/50">
                      Catalog classification
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/categories"
                  className="btn btn-ghost btn-xs text-secondary font-semibold"
                >
                  Manage &rarr;
                </Link>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="p-6 text-center">
                    <span className="loading loading-spinner loading-md text-secondary"></span>
                  </div>
                ) : recentCategories.length === 0 ? (
                  <div className="p-6 text-center text-base-content/60">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-secondary" />
                    <p className="text-xs">No categories created yet.</p>
                    <Link to="/admin/categories" className="btn btn-secondary btn-xs mt-3">
                      Add Category
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recentCategories.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-xs capitalize text-base-content">
                            {cat.category_name}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-base-content/40">
                          {cat._id.slice(-6)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-base-200 mt-2">
              <Link
                to="/admin/categories"
                className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-1.5 mt-3"
              >
                <Plus className="w-4 h-4" />
                Add New Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
