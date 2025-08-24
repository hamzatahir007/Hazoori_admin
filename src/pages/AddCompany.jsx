import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, getProductId, resetState, updateProduct } from "../features/product/productSlice";
import axios from "axios";
import { base_imageurl, base_url } from "../utils/baseUrl";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  // brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  condition: yup.string().required("Condition is Required"),
  bidtype: yup.string().required("Bidtype is Required"),
  // color: yup
  //   .array()
  //   .min(1, "Pick at least one color")
  //   .required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
  // images: yup.number().required("images is Required"),
});
const AddCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getPId = location.pathname.split("/")[3];
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  // console.log(color);
  useEffect(() => {
    // dispatch(getBrands());
    // dispatch(getCategories());
    // dispatch(getColors());
  }, []);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct, updatedProduct } = newProduct;

  useEffect(() => {
    //  console.log( getPCatId);
    //   return
    if (getPId !== undefined) {
      // console.log(getPId, 'Pid');
      dispatch(getProductId(getPId))
        .then((data) => {
          let productDetails = data?.payload;
          // console.log(productDetails.images , 'checking');
          // return
          formik.setValues(productDetails)
          setImages(productDetails.images)
          // formik.setFieldValue('name', data.payload.name); // Set the selected image to the form field
          // formik.setFieldValue('image', base_imageurl + data.payload.image); // Set the selected image to the form field

        })
    } else {
      dispatch(resetState());
    }
  }, [getPId]);


  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product updated Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  // const coloropt = [];
  // colorState?.forEach((i) => {
  //   coloropt.push({
  //     label: i.title,
  //     value: i._id,
  //   });
  // });
  const img = [];
  images?.forEach((i) => {
    // console.log(i,'helo');
    img.push(i);
  });

  // console.log(images,'helo');

  function convertTo14Hour(time24h) {
    const endDateTime = new Date(`${formik.values.endDateTime}T${time24h}`);

    console.log(time24h, endDateTime);
    return
    // Extracting hours and minutes from the time string
    var match = time24h.match(/^(\d+):(\d+)$/);
    if (!match) return null;

    var hours = parseInt(match[1]);
    var minutes = parseInt(match[2]);

    // Modifying hours for 14-hour format
    var period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    // Formatting the hours and minutes into 14-hour format
    var hours14 = hours.toString().padStart(2, "0");
    var minutes14 = minutes.toString().padStart(2, "0");

    return `${hours14}:${minutes14} ${period}`;
  }

  useEffect(() => {
    formik.values.color = color ? color : " ";
    formik.values.images = img;
  }, [color, img]);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      rate: "",
      category: "",
      tags: "",
      condition: "",
      bidtype: "",
      startDate: "",
      startTime: "",
      expiryDate: "",
      expiryTime: "",
      quantity: "",
      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (values.images?.length == 0) {
        alert('Please add atleast one product image.')
        return
      }
      if (values.bidtype == 'Auction') {
        if (values.startDate == "" || values.startTime == "") {
          alert('Please select Auction start Date/Time.')
          return
        }
        if (values.expiryDate == "" || values.expiryTime == "") {
          alert('Please select Auction end Date/Time.')
          return
        }
        handleSubmit(values)
        return
      }
      handleSubmit(values)
      // let uploadimages = values.images.length > 0 && Promise.all(values.images.map(async (img) => {
      //   if (typeof img === 'object' && 'url' in img) {
      //     return img
      //   }
      //   try {
      //     let formimage = new FormData()
      //     formimage.append('files', img,);
      //     let response = await axios.post(`${base_url}image`, formimage);
      //     if (response.status === 200) {
      //       // console.log(response.data, 'kkkk');
      //       return {
      //         public_id: response.data.data.filename,
      //         url: `images/${response.data.data.filename}`
      //       }
      //     }
      //     return
      //   } catch (e) {
      //     console.log('Image Server Error: ', e);
      //   }
      // }))
      // if (getPId !== undefined) {
      //   uploadimages
      //     .then((results) => {
      //       let updateValue = {
      //         ...values,
      //         images: results
      //       }
      //       // console.log(updateValue, 'update');
      //       dispatch(updateProduct(updateValue))
      //         .then((res) => {
      //           if (res?.payload?.res?.status == 400) {
      //             alert(res.payload.response.data.message);
      //             // setLoading(false)
      //             return
      //           }
      //           // console.log(res);
      //           alert(res?.payload?.msg)
      //           // return
      //           formik.resetForm();
      //           setImages([])
      //           setTimeout(() => {
      //             dispatch(resetState());
      //           }, 3000);
      //         })
      //         .catch((err) => {
      //           alert(`Server Error: Please try again, ${err}`)
      //         })
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     })
      //   return
      // }

      // uploadimages.then((results) => {
      //   let updateValue = {
      //     ...values,
      //     images: results
      //   }

      //   // console.log(updateValue, 'create new');
      //   // return
      //   dispatch(createProducts(updateValue))
      //     .then((res) => {
      //       // console.log(res);
      //       if (res?.payload?.res?.status == 400) {
      //         alert(res.payload.response.data.message);
      //         // setLoading(false)
      //         return
      //       }
      //       alert(res?.payload?.msg)
      //       formik.resetForm();
      //       setColor(null);
      //       setTimeout(() => {
      //         dispatch(resetState());
      //       }, 3000);
      //     })
      //   // console.log(updateValue, '======>'); // Array of uploaded image data
      // }).catch((err) => {
      //   console.log('Image Server Error: ', err);
      // });

      return
    },
  });

  const handleSubmit = async (values) => {
// console.log(values);
//     return
    let uploadimages = values.images.length > 0 && Promise.all(values.images.map(async (img) => {
      if (typeof img === 'object' && 'url' in img) {
        return img
      }
      try {
        let formimage = new FormData()
        formimage.append('files', img,);
        let response = await axios.post(`${base_url}image`, formimage);
        if (response.status === 200) {
          // console.log(response.data, 'kkkk');
          return {
            public_id: response.data.data.filename,
            url: `images/${response.data.data.filename}`
          }
        }
        return
      } catch (e) {
        console.log('Image Server Error: ', e);
      }
    }))
    if (getPId !== undefined) {
      uploadimages
        .then((results) => {
          let updateValue = {
            ...values,
            images: results
          }
          // console.log(updateValue, 'update');
          dispatch(updateProduct(updateValue))
            .then((res) => {
              if (res?.payload?.res?.status == 400) {
                alert(res.payload.response.data.message);
                // setLoading(false)
                return
              }
              // console.log(res);
              alert(res?.payload?.msg)
              // return
              formik.resetForm();
              setImages([])
              setTimeout(() => {
                dispatch(resetState());
              }, 3000);
            })
            .catch((err) => {
              alert(`Server Error: Please try again, ${err}`)
            })
        })
        .catch((err) => {
          console.log(err);
        })
      return
    }

    uploadimages.then((results) => {
      let updateValue = {
        ...values,
        images: results
      }

      // console.log(updateValue, 'create new');
      // return
      dispatch(createProducts(updateValue))
        .then((res) => {
          // console.log(res);
          if (res?.payload?.res?.status == 400) {
            alert(res.payload.response.data.message);
            // setLoading(false)
            return
          }
          alert(res?.payload?.msg)
          formik.resetForm();
          setColor(null);
          setImages([])
          setTimeout(() => {
            dispatch(resetState());
          }, 3000);
        })
      // console.log(updateValue, '======>'); // Array of uploaded image data
    }).catch((err) => {
      console.log('Image Server Error: ', err);
    });
  }
  const handleColors = (e) => {
    setColor(e);
    console.log(color);
  };


  const uploadImg = (acceptedFiles) => {
    const newImages = [...images, ...acceptedFiles];
    setImages(newImages);
    // formik.setFieldValue('images', newImages); // Set the selected image to the form field
  }
  const DeletImgFromState = (deleteFiles) => {
    if (typeof deleteFiles === 'object' && deleteFiles instanceof File) {
      const removeimg = images.filter(item => item != deleteFiles)
      setImages(removeimg);
      return
    } else if (typeof deleteFiles === 'object' && 'url' in deleteFiles) {
      // Image fetched from server
      // console.log(deleteFiles, 'url');
      dispatch(delImg(deleteFiles.public_id))
        .then((responce) => {
          // console.log(responce);
          const removeimg = images.filter(item => item != deleteFiles)
          setImages(removeimg);
        })
        .catch((e) => {
          alert(`Error remove image : ${e}`)
          console.log(e);
        })

      return
    }
  }
  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          {/* <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div> */}
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.name}>
                  {i.name}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">
              Select Category Tag
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          <select
            name="tags"
            onChange={formik.handleChange("condition")}
            onBlur={formik.handleBlur("condition")}
            value={formik.values.condition}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">
              Select Condition
            </option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <div className="error">
            {formik.touched.condition && formik.errors.condition}
          </div>

          <select
            name="tags"
            onChange={formik.handleChange("bidtype")}
            onBlur={formik.handleBlur("bidtype")}
            value={formik.values.bidtype}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">
              Select Bidding Type
            </option>
            <option value="Auction">Auction</option>
            <option value="Offer">Offer</option>
          </select>
          <div className="error">
            {formik.touched.bidtype && formik.errors.bidtype}
          </div>
          {formik.values.bidtype == 'Auction' ?
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{
                  fontWeight: 'bold'
                }}>
                  Auction Start
                </div>
                <CustomInput
                  type="date"
                  name="start"
                  onChng={formik.handleChange("startDate")}
                  onBlr={formik.handleBlur("startDate")}
                  val={formik.values.startDate}
                  label="Enter start Date"
                  id="date"
                />
                <CustomInput
                  type="time"
                  name="start"
                  onChng={formik.handleChange("startTime")}
                  onBlr={formik.handleBlur("startTime")}
                  val={formik.values.startTime}
                  label="Enter start Time"
                  id="time"
                />
                {/* <CustomDateTimeInput
                  label="Enter start Date and Time"
                  i_class="start-date-time"
                  val={formik.values.start}
                  onChange={(value) => formik.setFieldValue('start', value)}
                /> */}
              </div>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{
                  fontWeight: 'bold'
                }}>
                  Auction End
                </div>
                <CustomInput
                  type="date"
                  name="expiry"
                  onChng={formik.handleChange("expiryDate")}
                  onBlr={formik.handleBlur("expiryDate")}
                  val={formik.values.expiryDate}
                  label="Enter Expiry Date"
                  id="date"
                />
                <CustomInput
                  type="time"
                  name="expiry"
                  onChng={formik.handleChange("expiryTime")}
                  onBlr={formik.handleBlur("expiryTime")}
                  val={formik.values.expiryTime}
                  label="Enter Expiry Time"
                  id="time"
                />
                {/* <CustomDateTimeInput
                  label="Enter Expiry Date and Time"
                  i_class="expiry-date-time"
                  val={formik.values.expiry}
                  onChange={(value) => formik.setFieldValue('expiry', value)}
                /> */}
              </div>
            </div>
            : null}
          {/* <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div> */}
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={uploadImg}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="error">
            {formik.touched.images && formik.errors.images}
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {images?.map((image, j) => {
              let imageUrl;
              if (typeof image === 'object' && image instanceof File) {
                // Image selected from local PC
                imageUrl = URL.createObjectURL(image);
              } else if (typeof image === 'object' && 'url' in image) {
                // Image fetched from server
                imageUrl = base_imageurl + image.url;
              }
              // return
              return (
                <div className=" position-relative" key={j}>
                  <button
                    type="button"
                    onClick={() => DeletImgFromState(image)}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={imageUrl} alt="" width={200} height={200} />
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
