import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import categoryService from "../../services/categoryService";
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  FolderOpen,
} from "lucide-react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active item & form state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      if (data && data.categories) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showAlert(
        "error",
        error?.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setCategoryName("");
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setCategoryName(cat.category_name);
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setFormError("Category name is required");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const data = await categoryService.createCategory({
        category_name: categoryName.trim().toLowerCase(),
      });
      showAlert(
        "success",
        data?.message || "Category created successfully!"
      );
      setIsAddModalOpen(false);
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
      setFormError(
        error?.response?.data?.message || "Failed to create category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setFormError("Category name is required");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const data = await categoryService.updateCategory(
        selectedCategory._id,
        {
          category_name: categoryName.trim().toLowerCase(),
        }
      );
      showAlert(
        "success",
        data?.message || "Category updated successfully!"
      );
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
      setFormError(
        error?.response?.data?.message || "Failed to update category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const data = await categoryService.deleteCategory(selectedCategory._id);
      showAlert(
        "success",
        data?.message || "Category deleted successfully!"
      );
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      showAlert(
        "error",
        error?.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {alert && (
          <div
            className={`alert ${
              alert.type === "success" ? "alert-success text-white" : "alert-error text-white"
            } shadow-lg transition-all animate-fade-in flex items-center justify-between`}
          >
            <div className="flex items-center gap-2">
              {alert.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              className="btn btn-ghost btn-xs btn-circle text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-base-content">
              <Layers className="w-6 h-6 text-primary" />
              Category Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Create, read, update, and delete product categories for store classification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5"
              title="Refresh categories"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Table & Filter Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories by name..."
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
            <div className="text-xs text-base-content/60 font-medium">
              Total Categories: <span className="font-bold text-primary">{categories.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-3 font-medium">
                Loading categories...
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-base-content/60">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
              <p className="font-semibold text-base">
                {search ? "No categories matching your search" : "No categories found"}
              </p>
              <p className="text-xs mt-1">
                {search
                  ? "Try changing your search keywords."
                  : "Get started by adding your first product category."}
              </p>
              {!search && (
                <button
                  onClick={openAddModal}
                  className="btn btn-primary btn-sm mt-4 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add New Category
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs font-bold text-base-content/70">
                    <th className="w-16">#</th>
                    <th>Category Name</th>
                    <th>Category ID</th>
                    <th>Created Date</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, index) => (
                    <tr key={cat._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="font-mono text-xs text-base-content/50">
                        {index + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <Layers className="w-4 h-4" />
                          </span>
                          <span className="font-semibold text-sm capitalize text-base-content">
                            {cat.category_name}
                          </span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-base-content/60">
                        {cat._id}
                      </td>
                      <td className="text-xs text-base-content/60">
                        {cat.createdAt
                          ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="btn btn-ghost btn-xs text-info hover:bg-info/10 flex items-center gap-1"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(cat)}
                            className="btn btn-ghost btn-xs text-error hover:bg-error/10 flex items-center gap-1"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <Plus className="w-5 h-5 text-primary" />
                Add New Category
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {formError && (
                <div className="alert alert-error text-xs text-white py-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Category Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Footwear, Books"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="input input-bordered w-full"
                  autoFocus
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    Category names are unique and case-insensitive.
                  </span>
                </label>
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <Edit3 className="w-5 h-5 text-info" />
                Edit Category
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              {formError && (
                <div className="alert alert-error text-xs text-white py-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Category Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Footwear"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="input input-bordered w-full"
                  autoFocus
                  required
                />
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-info text-white btn-sm flex items-center gap-1.5"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-error">
                <Trash2 className="w-5 h-5" />
                Delete Category
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-sm text-base-content/80">
                Are you sure you want to delete the category:{" "}
                <span className="font-bold text-base-content capitalize">
                  "{selectedCategory.category_name}"
                </span>
                ?
              </p>
              <p className="text-xs text-error/80 bg-error/10 p-3 rounded-lg border border-error/20">
                Warning: This action is permanent and will remove this category from the system.
              </p>
            </div>

            <div className="modal-action pt-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-error text-white btn-sm flex items-center gap-1.5"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
