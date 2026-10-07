import axiosInstance from "../api/api";

const categoryService = {
  getAllCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },
  getSingleCategory: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (body) => {
    const response = await axiosInstance.post("/categories", body);
    return response.data;
  },
  updateCategory: async (id, body) => {
    const response = await axiosInstance.put(`/categories/${id}`, body);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
