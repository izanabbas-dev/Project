import React, { useState } from "react";
import Layout from "../components/Layout";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import orderService from "../services/orderService";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowRight,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  MapPin,
  ArrowLeft,
  X,
} from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const shippingCost = totalAmount > 50 || totalAmount === 0 ? 0 : 9.99;
  const grandTotal = totalAmount + shippingCost;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please provide a valid shipping address");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id,
          product_name: item.product_name,
          price: Number(item.price),
          quantity: item.quantity,
          product_image: item.product_image || "",
        })),
        totalAmount: grandTotal,
        shippingAddress: shippingAddress.trim(),
      };

      const res = await orderService.createOrder(orderPayload);
      if (res && res.success) {
        setPlacedOrder(res.order);
        clearCart();
      } else {
        setError(res?.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to place order. Please check your network and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully placed
  if (placedOrder) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-8 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto ring-8 ring-success/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="badge badge-success text-white font-bold text-xs">
                Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                Thank You for Your Purchase!
              </h2>
              <p className="text-sm text-base-content/60">
                Your order has been received and is now being processed for delivery.
              </p>
            </div>

            <div className="bg-base-200/60 rounded-2xl p-5 border border-base-300 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-base-300/60">
                <span className="text-base-content/60">Order Number</span>
                <span className="font-mono font-bold text-primary text-sm">
                  #{placedOrder._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Total Paid</span>
                <span className="font-extrabold text-base-content text-sm">
                  ${Number(placedOrder.totalAmount || grandTotal).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Shipping Destination</span>
                <span className="font-medium text-base-content truncate max-w-xs">
                  {placedOrder.shippingAddress || shippingAddress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">Status</span>
                <span className="badge badge-sm badge-warning font-semibold text-white">
                  {placedOrder.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/orders"
                className="btn btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                View My Orders
              </Link>
              <Link
                to="/products"
                className="btn btn-outline btn-md w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 text-center px-4">
          <div className="card bg-base-100 border border-base-300 shadow-sm p-10 sm:p-14 rounded-3xl max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-base-content/60 mt-2 mb-8">
              Looks like you haven't added anything to your cart yet. Explore our top-tier collection and find what you love!
            </p>
            <Link
              to="/products"
              className="btn btn-primary btn-md flex items-center justify-center gap-2 shadow-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Products Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 py-2 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2.5 text-base-content tracking-tight">
              <ShoppingCart className="w-7 h-7 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              You have <span className="font-bold text-primary">{totalItems}</span> item(s) in your basket
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={clearCart}
              className="btn btn-ghost btn-sm text-error hover:bg-error/10 flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error text-white text-sm flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="btn btn-ghost btn-xs btn-circle text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Cart Items List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-base-200 text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center justify-between">
                <span>Selected Items</span>
                <span>Subtotal</span>
              </div>

              <div className="divide-y divide-base-200">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-base-200/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-20 h-20 rounded-xl bg-base-200 overflow-hidden border border-base-300 shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base-content/40">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <span className="text-[11px] font-semibold text-primary uppercase">
                          {typeof item.category === "object"
                            ? item.category?.category_name || "Catalog Item"
                            : item.category || "Catalog Item"}
                        </span>
                        <h3 className="font-bold text-sm text-base-content truncate max-w-sm">
                          {item.product_name}
                        </h3>
                        <p className="text-xs font-semibold text-base-content/70">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-base-200">
                      {/* Quantity Stepper */}
                      <div className="join border border-base-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="join-item btn btn-xs btn-ghost px-2"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="join-item px-3 py-1 text-xs font-bold flex items-center justify-center min-w-8 bg-base-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="join-item btn btn-xs btn-ghost px-2"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-20">
                        <p className="font-extrabold text-sm text-base-content">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 text-xs text-base-content/70">
              <Truck className="w-5 h-5 text-primary shrink-0" />
              <span>
                Enjoy <strong className="text-primary font-bold">Free Standard Shipping</strong> on all orders over $50.00!
              </span>
            </div>
          </div>

          {/* Order Checkout Summary (1 col) */}
          <div className="space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl p-6 space-y-5">
              <h2 className="font-extrabold text-lg text-base-content pb-3 border-b border-base-200">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-base-content/70">
                  <span>Items Subtotal ({totalItems})</span>
                  <span className="font-bold text-base-content text-sm">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base-content/70">
                  <span>Shipping Estimate</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="badge badge-success badge-sm font-semibold text-white">
                        Free
                      </span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-base-200 flex items-center justify-between text-sm font-black text-base-content">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-primary">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2 border-t border-base-200">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs flex items-center gap-1.5 text-base-content">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Delivery Shipping Address <span className="text-error">*</span>
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter your complete delivery address (street, city, zip)..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="textarea textarea-bordered text-xs w-full"
                    required
                  />
                </div>

                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-600 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      You must be signed in to complete your purchase.
                    </p>
                    <Link
                      to="/login"
                      className="btn btn-primary btn-md w-full font-bold shadow-sm"
                    >
                      Sign in to Place Order
                    </Link>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-md w-full font-extrabold shadow-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Place Order (${grandTotal.toFixed(2)})
                      </>
                    )}
                  </button>
                )}
              </form>

              <div className="text-[11px] text-center text-base-content/50 pt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Encrypted 256-bit secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
