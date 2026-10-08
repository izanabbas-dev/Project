import axiosInstance from "../api/api";

const statsService = {
  getStats: async () => {
    const response = await axiosInstance.get("/stats");
    return response.data;
  },
};

export default statsService;
