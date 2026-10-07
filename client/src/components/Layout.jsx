import React from "react";
import Navbar from "./Navbar";
import { ShoppingBag } from "lucide-react";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200/50 text-base-content">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="footer footer-center p-6 bg-base-100 text-base-content/70 border-t border-base-200">
        <aside className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <p className="text-sm">
            E-Commerce Store &bull; Admin &amp; Customer Portal
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default Layout;
