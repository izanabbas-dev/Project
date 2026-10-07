import axiosInstance from "../api/api";

const productService = {
  getAllProducts: async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },
  getSingleProduct: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (formData) => {
    const response = await axiosInstance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateProduct: async (id, body) => {
    const response = await axiosInstance.put(`/products/${id}`, body);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
