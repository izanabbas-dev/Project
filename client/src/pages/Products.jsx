import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import productService from "../services/productService";
import {
  Package,
  ShoppingCart,
  Star,
  Search,
  Filter,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultProducts = [
    {
      _id: "prod-1",
      product_name: "Wireless Noise Cancelling Headphones",
      price: 149.99,
      category: { category_name: "Audio & Sound" },
      rating: 4.8,
      reviews: 142,
      product_image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-2",
      product_name: "Minimalist Ergonomic Mechanical Keyboard",
      price: 89.99,
      category: { category_name: "Electronics" },
      rating: 4.9,
      reviews: 98,
      product_image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-3",
      product_name: "Classic Chronograph Leather Watch",
      price: 189.0,
      category: { category_name: "Watches" },
      rating: 4.7,
      reviews: 65,
      product_image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-4",
      product_name: "Ultra-Lightweight Running Sneakers",
      price: 79.5,
      category: { category_name: "Fashion" },
      rating: 4.6,
      reviews: 210,
      product_image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-5",
      product_name: "Smart Fitness Activity Tracker Band",
      price: 49.99,
      category: { category_name: "Electronics" },
      rating: 4.5,
      reviews: 118,
      product_image:
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "prod-6",
      product_name: "Premium Stainless Steel Insulated Bottle",
      price: 29.99,
      category: { category_name: "Home & Living" },
      rating: 4.9,
      reviews: 312,
      product_image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        if (data?.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(defaultProducts);
        }
      } catch (err) {
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 py-2">
        {/* Header and Search */}
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              All Products Catalog
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Showing {filteredProducts.length} items available in store
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-base-content/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title..."
              className="input input-bordered input-md w-full pl-9"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-base-200 overflow-hidden relative">
                  <img
                    src={
                      item.product_image ||
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                  <span className="text-lg font-black text-base-content">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
                <button className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
