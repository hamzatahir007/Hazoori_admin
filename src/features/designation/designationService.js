import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getAllDesignation = async () => {
  const response = await axios.get(`${base_url}designations/`, config);
console.log('ooo');

  return response.data;
};

const createNewDesignation = async (depcat) => {
  const response = await axios.post(`${base_url}designations/add/`, depcat, config);

  return response.data;
};

const updateDesignation = async (designation) => {
  const response = await axios.put(
    `${base_url}designations/${designation.id}`,
    designation.data,
    config
  );
  return response.data;
};

const getDesignationById = async (id) => {
  const response = await axios.get(`${base_url}designations/all/${id}`, config);

  return response.data;
};

const deleteDesignationById = async (id) => {
  const response = await axios.delete(`${base_url}designations/delete/${id}`, config);

  return response.data;
};

const getDesignation = async (id) => {
  const response = await axios.get(`${base_url}designations/${id}`, config);

  return response.data;
};

const designationService = {
  getDesignation,
  createNewDesignation,
  deleteDesignationById,
  getDesignationById,
  getAllDesignation,
  updateDesignation,
};

export default designationService;
