import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getEmployees = async (user) => {
  const response = await axios.get(`${base_url}auth/allusers/`);
  const filterdata = response.data.length > 0 && response.data.filter(res => res._id !== user?._id)
  return filterdata;
};
const createEmployee = async (category) => {
  const response = await axios.post(`${base_url}auth/register`, category, config);
  return response.data;
};

const getEmployeesByCompany = async (id) => {
  const response = await axios.get(`${base_url}auth/user/all/${id}`, config);
  return response.data;
};

const getEmployeeById = async (id) => {
  const response = await axios.get(`${base_url}auth/user/${id}`, config);
  // console.log(response.data , 'helllo');
  return response.data;
};

const deleteEmployeeById = async (id) => {
  // console.log(id);

  const response = await axios.delete(`${base_url}auth/user/${id}`, config);
  return response.data;
};

const updateEmployee = async (category) => {
  const response = await axios.put(
    `${base_url}auth/updateuser/${category.id}`,
    category.pCatData,
    config
  );
  return response.data;
};
const employeeService = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployee,
  getEmployeesByCompany,
};

export default employeeService;
