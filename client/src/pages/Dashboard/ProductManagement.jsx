import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Eye,
  Filter,
} from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Active item & form state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getAllProducts().catch(() => ({ products: [] })),
        categoryService.getAllCategories().catch(() => ({ categories: [] })),
      ]);

      if (prodRes && prodRes.products) {
        setProducts(prodRes.products);
      } else if (Array.isArray(prodRes)) {
        setProducts(prodRes);
      } else {
        setProducts([]);
      }

      if (catRes && catRes.categories) {
        setCategories(catRes.categories);
      } else if (Array.isArray(catRes)) {
        setCategories(catRes);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load products/categories:", error);
      showAlert("error", "Failed to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setFormData({
      product_name: "",
      price: "",
      category: categories.length > 0 ? categories[0]._id : "",
    });
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      product_name: prod.product_name || "",
      price: prod.price || "",
      category:
        typeof prod.category === "object"
          ? prod.category?._id
          : prod.category || "",
    });
    setImageFile(null);
    setImagePreview(prod.product_image || "");
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (prod) => {
    setSelectedProduct(prod);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (prod) => {
    setSelectedProduct(prod);
    setIsViewModalOpen(true);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.product_name.trim()) {
      setFormError("Product name is required");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError("Please enter a valid price");
      return;
    }
    if (!formData.category) {
      setFormError("Please select a category");
      return;
    }
    if (!imageFile) {
      setFormError("Product image is required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const data = new FormData();
      data.append("product_name", formData.product_name.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("product_img", imageFile);

      const response = await productService.createProduct(data);
      showAlert(
        "success",
        response?.message || "Product created successfully!"
      );
      setIsAddModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create product:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!formData.product_name.trim()) {
      setFormError("Product name is required");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError("Please enter a valid price");
      return;
    }
    if (!formData.category) {
      setFormError("Please select a category");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const data = new FormData();
      data.append("product_name", formData.product_name.trim());
      data.append("price", formData.price);
      data.append("category", formData.category);
      if (imageFile) {
        data.append("product_img", imageFile);
      }

      const response = await productService.updateProduct(
        selectedProduct._id,
        data
      );
      showAlert(
        "success",
        response?.message || "Product updated successfully!"
      );
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update product:", error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      const data = await productService.deleteProduct(selectedProduct._id);
      showAlert(
        "success",
        data?.message || "Product deleted successfully!"
      );
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      showAlert(
        "error",
        error?.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof prod.category === "object"
        ? prod.category?.category_name?.toLowerCase().includes(search.toLowerCase())
        : false);

    const matchesCategory =
      categoryFilter === "all" ||
      (typeof prod.category === "object"
        ? prod.category?._id === categoryFilter
        : prod.category === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Alert Toast */}
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
              <Package className="w-6 h-6 text-primary" />
              Product Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Create, read, update, and delete products, manage inventory prices and images.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn btn-ghost btn-sm border border-base-300 flex items-center gap-1.5"
              title="Refresh products"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-base-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input input-bordered input-sm w-full pl-9"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-base-content/50 hidden sm:inline" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="select select-bordered select-sm w-full sm:w-48 capitalize"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="capitalize">
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-base-content/60 font-medium">
              Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of {products.length} Products
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60 mt-3 font-medium">
                Loading products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-base-content/60">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
              <p className="font-semibold text-base">
                {search || categoryFilter !== "all"
                  ? "No products match the selected criteria"
                  : "No products available in the catalog"}
              </p>
              <p className="text-xs mt-1">
                {search || categoryFilter !== "all"
                  ? "Try resetting filters or searching with different terms."
                  : "Add your first product listing with an image and pricing."}
              </p>
              {!search && categoryFilter === "all" && (
                <button
                  onClick={openAddModal}
                  className="btn btn-primary btn-sm mt-4 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs font-bold text-base-content/70">
                    <th className="w-16">#</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Created</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod, index) => {
                    const categoryName =
                      typeof prod.category === "object" && prod.category?.category_name
                        ? prod.category.category_name
                        : categories.find((c) => c._id === prod.category)?.category_name || "Uncategorized";

                    return (
                      <tr key={prod._id} className="hover:bg-base-200/40 transition-colors">
                        <td className="font-mono text-xs text-base-content/50">
                          {index + 1}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12 bg-base-200 border border-base-300">
                                {prod.product_image ? (
                                  <img
                                    src={prod.product_image}
                                    alt={prod.product_name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full text-base-content/40">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-sm text-base-content">
                                {prod.product_name}
                              </div>
                              <div className="text-xs text-base-content/50 font-mono">
                                ID: {prod._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-sm badge-outline border-primary/40 text-primary font-medium capitalize">
                            {categoryName}
                          </span>
                        </td>
                        <td className="font-bold text-sm text-base-content">
                          ${Number(prod.price).toFixed(2)}
                        </td>
                        <td className="text-xs text-base-content/60">
                          {prod.createdAt
                            ? new Date(prod.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openViewModal(prod)}
                              className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(prod)}
                              className="btn btn-ghost btn-xs text-info hover:bg-info/10"
                              title="Edit Product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(prod)}
                              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300 max-w-lg">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <Plus className="w-5 h-5 text-primary" />
                Add New Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
              {formError && (
                <div className="alert alert-error text-xs text-white py-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Product Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm">
                      Price ($) <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm">
                      Category <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select select-bordered w-full capitalize"
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="capitalize">
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Product Image <span className="text-error">*</span>
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered file-input-primary file-input-sm w-full"
                    required
                  />
                  {imagePreview && (
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-lg border border-base-300 overflow-hidden shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-action pt-3">
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
                      Uploading & Creating...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300 max-w-lg">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <Edit3 className="w-5 h-5 text-info" />
                Edit Product
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 pt-4">
              {formError && (
                <div className="alert alert-error text-xs text-white py-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Product Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Product name"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm">
                      Price ($) <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="99.99"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm">
                      Category <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select select-bordered w-full capitalize"
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="capitalize">
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm">
                    Product Image (optional update)
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered file-input-info file-input-sm w-full"
                  />
                  {imagePreview && (
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-lg border border-base-300 overflow-hidden shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-action pt-3">
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
                      Saving Changes...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg flex items-center gap-2 text-error">
                <Trash2 className="w-5 h-5" />
                Delete Product
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                {selectedProduct.product_image && (
                  <img
                    src={selectedProduct.product_image}
                    alt={selectedProduct.product_name}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-sm text-base-content">
                    {selectedProduct.product_name}
                  </p>
                  <p className="text-xs text-base-content/60">
                    Price: ${Number(selectedProduct.price).toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-error/80 bg-error/10 p-3 rounded-lg border border-error/20">
                Are you sure you want to delete this product? This will remove the listing and image from Cloudinary permanently.
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
                onClick={handleDeleteProduct}
                className="btn btn-error text-white btn-sm flex items-center gap-1.5"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box border border-base-300 max-w-md">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-lg text-base-content">Product Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <div className="w-full h-56 rounded-xl overflow-hidden bg-base-200 border border-base-300">
                <img
                  src={selectedProduct.product_image}
                  alt={selectedProduct.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-base-content">
                  {selectedProduct.product_name}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-extrabold text-primary">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </span>
                  <span className="badge badge-primary badge-outline capitalize">
                    {typeof selectedProduct.category === "object"
                      ? selectedProduct.category?.category_name
                      : "General"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-base-content/60 space-y-1 pt-2 border-t border-base-200">
                <p>
                  <span className="font-semibold text-base-content/80">Product ID:</span>{" "}
                  {selectedProduct._id}
                </p>
                <p>
                  <span className="font-semibold text-base-content/80">Created:</span>{" "}
                  {selectedProduct.createdAt
                    ? new Date(selectedProduct.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="modal-action pt-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-primary btn-sm w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
