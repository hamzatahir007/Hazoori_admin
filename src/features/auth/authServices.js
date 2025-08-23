import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const getOrders = async () => {
  const response = await axios.get(`${base_url}order/getAllOrders`, config);
  return response.data;
};

const getOrder = async (id) => {
  const response = await axios.get(`${base_url}order/getOrderbyId/${id}`, config);
  // console.log('======>' , response.data);
  return response.data;
};

const updateOrderById = async (id) => {
  // console.log(id , 'check');
  // return
  const response = await axios.put(`${base_url}order/updateOrderbyId/${id.id}/${id.status}`, config);
  // console.log('======>' , response.data);
  return response.data;
};

const deleteOrderById = async (id) => {
  // console.log(id , 'check');
  // return
  const response = await axios.delete(`${base_url}order/deleteOrderbyId/${id.id}/${id.status}`, config);
  // console.log('======>' , response.data);
  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  updateOrderById,
  deleteOrderById
};

export default authService;
