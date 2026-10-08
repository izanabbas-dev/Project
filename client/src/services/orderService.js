import axiosInstance from "../api/api";

const orderService = {
  getAllOrders: async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },
  getMyOrders: async () => {
    const response = await axiosInstance.get("/orders/my-orders");
    return response.data;
  },
  createOrder: async (body) => {
    const response = await axiosInstance.post("/orders", body);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default orderService;
