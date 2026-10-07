import React from "react";
import Layout from "../components/Layout";
import { ShoppingCart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 text-center space-y-6">
        <div className="card bg-base-100 border border-base-300 shadow-sm p-12 rounded-2xl max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">Your Cart is Currently Empty</h2>
          <p className="text-sm text-base-content/60 mt-2 mb-6">
            Looks like you haven't added anything to your cart yet. Explore our featured collection and start shopping!
          </p>
          <Link to="/products" className="btn btn-primary btn-md flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
