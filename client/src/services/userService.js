import axiosInstance from "../api/api";

const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },
};

export default userService;
