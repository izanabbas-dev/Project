import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import productService from "../services/productService";
import {
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  ArrowRight,
  Heart,
  Eye,
  Sparkles,
  Zap,
  Laptop,
  Shirt,
  Headphones as AudioIcon,
  Watch,
  Home as HomeIconCat,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample static category collection for e-commerce browsing
  const featuredCategories = [
    { name: "Electronics", items: "120+ Items", icon: Laptop },
    { name: "Fashion", items: "350+ Items", icon: Shirt },
    { name: "Audio & Sound", items: "85+ Items", icon: AudioIcon },
    { name: "Watches & Wearables", items: "64+ Items", icon: Watch },
    { name: "Home & Living", items: "210+ Items", icon: HomeIconCat },
    { name: "Trending Deals", items: "50+ Items", icon: Flame },
  ];

  // Sample fallback products if database is empty
  const defaultProducts = [
    {
      _id: "prod-1",
      product_name: "Wireless Noise Cancelling Headphones",
      price: 149.99,
      oldPrice: 199.99,
      category: { category_name: "Audio & Sound" },
      rating: 4.8,
      reviews: 142,
      badge: "Best Seller",
      product_image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-2",
      product_name: "Minimalist Ergonomic Mechanical Keyboard",
      price: 89.99,
      oldPrice: 119.99,
      category: { category_name: "Electronics" },
      rating: 4.9,
      reviews: 98,
      badge: "Popular",
      product_image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-3",
      product_name: "Classic Chronograph Leather Watch",
      price: 189.0,
      oldPrice: 240.0,
      category: { category_name: "Watches" },
      rating: 4.7,
      reviews: 65,
      badge: "Sale",
      product_image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-4",
      product_name: "Ultra-Lightweight Running Sneakers",
      price: 79.5,
      oldPrice: 99.0,
      category: { category_name: "Fashion" },
      rating: 4.6,
      reviews: 210,
      badge: "New",
      product_image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        if (res && res.products && res.products.length > 0) {
          setProducts(res.products);
        } else {
          setProducts(defaultProducts);
        }
      } catch (err) {
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="bg-neutral text-neutral-content rounded-2xl p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary text-primary-content text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mega Seasonal Sale &bull; Up to 40% Off</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Upgrade Your Everyday Lifestyle
            </h1>
            <p className="text-neutral-content/80 text-base sm:text-lg">
              Explore thousands of top-tier electronics, fashion, and accessories
              with swift delivery and seamless checkout.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/products"
                className="btn btn-primary btn-md px-6 flex items-center gap-2 font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn btn-outline btn-md text-neutral-content border-neutral-content/30 hover:bg-neutral-content/10"
                >
                  Join Us Today
                </Link>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-base-100 text-base-content rounded-xl p-5 border border-base-300 shadow-md">
              <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Zap className="w-4 h-4 text-warning" />
                  <span>Deal of the Day</span>
                </div>
                <span className="badge badge-error badge-sm font-bold text-white">
                  Limited Time
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
                alt="Deal of Day"
                className="w-full h-44 object-cover rounded-lg mb-3 bg-base-200"
              />
              <h3 className="font-bold text-sm truncate">
                Pro Wireless Noise Cancelling Headset
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-primary">
                    $149.99
                  </span>
                  <span className="text-xs text-base-content/50 line-through">
                    $199.99
                  </span>
                </div>
                <Link
                  to="/products"
                  className="btn btn-primary btn-xs flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges / Services */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-base-content">Free Shipping</h4>
              <p className="text-xs text-base-content/60">On orders over $50</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-base-content">Secure Payments</h4>
              <p className="text-xs text-base-content/60">100% Protected transactions</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-base-content">Easy Returns</h4>
              <p className="text-xs text-base-content/60">30-day money back guarantee</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-base-content">24/7 Support</h4>
              <p className="text-xs text-base-content/60">Dedicated customer care</p>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
                Browse our curated selection across popular departments
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to="/products"
                  className="card bg-base-100 border border-base-300 hover:border-primary p-4 rounded-xl text-center transition-colors shadow-sm flex flex-col items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-base-200 group-hover:bg-primary group-hover:text-primary-content text-primary flex items-center justify-center mb-2 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-base-content group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-base-content/50 mt-0.5">
                    {cat.items}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending Products Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
                <Flame className="w-6 h-6 text-primary" />
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
                Top rated and trending items handpicked for you
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item._id}
                className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-base-200 overflow-hidden">
                    <img
                      src={
                        item.product_image ||
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
                      }
                      alt={item.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.badge && (
                      <span className="badge badge-primary badge-sm absolute top-3 left-3 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                      {typeof item.category === "object"
                        ? item.category?.category_name || "General"
                        : item.category || "General"}
                    </div>
                    <h3 className="font-bold text-sm text-base-content line-clamp-2 min-h-10 hover:text-primary">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center gap-1 text-warning text-xs">
                      <Star className="w-3.5 h-3.5 fill-warning" />
                      <span className="font-bold text-base-content text-xs">
                        {item.rating || 4.8}
                      </span>
                      <span className="text-base-content/50 text-[11px]">
                        ({item.reviews || 84})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-baseline justify-between pt-2 border-t border-base-200 mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-base-content">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-base-content/40 line-through">
                          ${Number(item.oldPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Offer Banner */}
        <section className="bg-base-100 border border-base-300 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="badge badge-secondary badge-sm font-semibold">
              Special Discount
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-base-content">
              Subscribe &amp; Get 15% Off Your First Order
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70 max-w-lg">
              Sign up for our newsletter to receive member-exclusive promotions,
              new drop notifications, and weekly discounts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered input-sm sm:input-md w-full sm:w-64"
            />
            <button className="btn btn-primary btn-sm sm:btn-md font-semibold">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
