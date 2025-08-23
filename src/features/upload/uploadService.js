import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const uploadImg = async (data) => {
  // console.log(data,'===');
  // return
  const response = await axios.post(`${base_url}image/`, data);
  return response.data;
};
const deleteImg = async (id) => {
  const response = await axios.delete(
    `${base_url}image/${id}`,
    config
  );
  return response.data;
};

const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
