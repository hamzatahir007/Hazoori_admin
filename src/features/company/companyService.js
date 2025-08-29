import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getCompany = async () => {
  const response = await axios.get(`${base_url}company/`);
  // console.log(response.data);
  return response.data;
};
const createCompany = async (category) => {
  // console.log(category, 'POST' , `${base_url}auth/companyregister/`);
  // return
  const response = await axios.post(`${base_url}auth/companyregister`, category, config);

  return response.data;
};

const getCompanyById = async (id) => {
  const response = await axios.get(`${base_url}company/${id}`, config);
  // console.log(response.data , 'helllo');
  return response.data;
};

const deleteCompanyById = async (id) => {
  const response = await axios.delete(`${base_url}company/${id}`, config);

  return response.data;
};
const updateCompany = async (category) => {
  // console.log(category,'test');
  // return
  const response = await axios.put(
    `${base_url}company/${category.id}`,
    { name: category.pCatData.name, image: category.pCatData.image },
    config
  );

  return response.data;
};
const companyService = {
  getCompany,
  createCompany,
  getCompanyById,
  deleteCompanyById,
  updateCompany,
};

export default companyService;
