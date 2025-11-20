import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getAllShifts = async () => {
  const response = await axios.get(`${base_url}shifts/`, config);
  console.log('ooo');

  return response.data;
};

const createNewShift = async (depcat) => {
  const response = await axios.post(`${base_url}shifts/add/`, depcat, config);

  return response.data;
};

const updateShift = async (designation) => {
  const response = await axios.put(
    `${base_url}shifts/${designation.id}`,
    designation.data,
    config
  );
  return response.data;
};

const getShiftsByCompany = async (id) => {
  const response = await axios.get(`${base_url}shifts/all/${id}`, config);

  return response.data;
};

const deleteShiftById = async (id) => {
  const response = await axios.delete(`${base_url}shifts/delete/${id}`, config);

  return response.data;
};

const getShiftById = async (id) => {
  const response = await axios.get(`${base_url}shifts/${id}`, config);

  return response.data;
};

const designationService = {
  getShiftById,
  createNewShift,
  deleteShiftById,
  getShiftsByCompany,
  getAllShifts,
  updateShift,
};

export default designationService;
