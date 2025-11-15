import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getAllDepartment = async () => {
  const response = await axios.get(`${base_url}departments/`, config);

  return response.data;
};
const createNewDepartment = async (depcat) => {
  const response = await axios.post(`${base_url}departments/add/`, depcat, config);

  return response.data;
};
const updateDepartment = async (department) => {
  const response = await axios.put(
    `${base_url}departments/${department.id}`,
    department.data,
    config
  );

  return response.data;
};

const getDepartmentById = async (id) => {
  const response = await axios.get(`${base_url}departments/all/${id}`, config);

  return response.data;
};

const deleteDepartmentById = async (id) => {
  const response = await axios.delete(`${base_url}departments/delete/${id}`, config);

  return response.data;
};

const getDepartment = async (id) => {
  const response = await axios.get(`${base_url}departments/${id}`, config);

  return response.data;
};

const departmentService = {
  getDepartment,
  createNewDepartment,
  deleteDepartmentById,
  getDepartmentById,
  getAllDepartment,
  updateDepartment,
};

export default departmentService;
