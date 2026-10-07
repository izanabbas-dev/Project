import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { Layers, Plus, Search, Filter } from "lucide-react";

export default function CategoryManagement() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-base-content">
              <Layers className="w-6 h-6 text-primary" />
              Category Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Add, edit, view, and remove categories for store items.
            </p>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Placeholder Table Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
              <input
                type="text"
                placeholder="Search categories..."
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
          </div>
          <div className="p-12 text-center text-base-content/60">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-semibold text-base">Category CRUD Ready</p>
            <p className="text-xs mt-1">Category operations can now be integrated in the next step.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
