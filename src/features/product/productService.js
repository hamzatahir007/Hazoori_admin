import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(`${base_url}product/`);

  return response.data;
};
const createProduct = async (product) => {
  const response = await axios.post(`${base_url}product/`, product, config);

  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${base_url}product/${id}`, config);

  return response.data;
};

const getProductId = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`, config);
  // console.log(response.data , 'helllo');
  // return
  return response.data;
};


const updateProduct = async (product) => {
  // console.log(`${base_url}product/${product._id}`, 'test');
  // return
  const response = await axios.put(
    `${base_url}product/${product._id}`,
    {
      title: product.title,
      bidtype: product.bidtype,
      category: product.category,
      condition: product.condition,
      description: product.description,
      images: product.images,
      price: product.price,
      quantity: product.quantity,
      slug: product.slug,
      tags: product.tags,
      startDate: product.startDate,
      startTime: product.startTime,
      expiryDate: product.expiryDate,
      expiryTime: product.expiryTime,
      // image: product.image
    },
    config
  );

  return response.data;
};

const updateProductQty = async (product) => {
  const response = await axios.put(
    `${base_url}product/updateProductQty/${product.id}`,
    {
      title: product.title,
      bidtype: product.bidtype,
      category: product.category,
      condition: product.condition,
      description: product.description,
      images: product.images,
      price: product.price,
      quantity: product.quantity,
      slug: product.slug,
      tags: product.tags,
      startDate: product.startDate,
      startTime: product.startTime,
      expiryDate: product.expiryDate,
      expiryTime: product.expiryTime,
      // image: product.image
    },
    config
  );

  return response.data;
}

const productService = {
  getProducts,
  createProduct,
  getProductId,
  updateProduct,
  deleteProduct,
  updateProductQty
};

export default productService;
