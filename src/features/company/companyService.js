import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getCompanies = async (user) => {
  const response = await axios.get(`${base_url}auth/allcompanies/`);
  const filterdata = response.data.length > 0 && response.data.filter(res => res._id !== user?._id)
  return filterdata;
};
const createCompany = async (category) => {
  const response = await axios.post(`${base_url}auth/companyregister`, category, config);

  return response.data;
};

const getCompanyById = async (id) => {
  const response = await axios.get(`${base_url}auth/company/${id}`, config);
  // console.log(response.data , 'helllo');
  return response.data;
};

const deleteCompanyById = async (id) => {
  // console.log(id);

  const response = await axios.delete(`${base_url}auth/company/${id}`, config);
  return response.data;
};

const updateCompany = async (category) => {
  const response = await axios.put(
    `${base_url}auth/updatecompany/${category.id}`,
    category.pCatData,
    config
  );
  return response.data;
};
const companyService = {
  getCompanies,
  createCompany,
  getCompanyById,
  deleteCompanyById,
  updateCompany,
};

export default companyService;
