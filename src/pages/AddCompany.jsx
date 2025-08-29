import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import { base_imageurl, base_url } from "../utils/baseUrl";
import axios from "axios";
import { createCompany, getCompanyById, resetState, updateCompany } from "../features/company/companySlice";
import MapModal from "../components/MapModal";
import { WEB_Color } from "../constans/Colors";


let schema = yup.object().shape({
  name: yup.string().required("Company Name is Required"),
  email: yup.string().required("Email is Required"),
  password: yup.string().required("Password is Required"),
  address: yup.string().required("Address is Required"),
  officeLocation: yup.string().required("Location is Required"),
  radius: yup.string().required("Radius is Required"),
  status: yup.string().required("Status is Required"),
  image: yup.mixed().nullable(),
});

const AddCompany = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const newCategory = useSelector((state) => state.company);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCompany,
    companyName,
    updatedCompany,
  } = newCategory;
  // console.log(newCategory);

  useEffect(() => {
    console.log(getPCatId);
    //   return
    if (getPCatId !== undefined) {
      dispatch(getCompanyById(getPCatId))
        .then((data) => {
          // console.log(data.payload,'====');
          formik.setFieldValue('name', data.payload.name); // Set the selected image to the form field
          formik.setFieldValue('image', base_imageurl + data.payload.image); // Set the selected image to the form field

        })
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);

  useEffect(() => {
    if (isSuccess && createdCompany) {
      toast.success("Company Added Successfullly!");
    }
    if (isSuccess && updatedCompany) {
      toast.success("Company Updated Successfullly!");
      navigate("/admin/list-company");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);


  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      officeLocation: "",
      radius: "",
      status: "",
      image: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {

      const [lat, lng] = values.officeLocation.split(",").map(Number);
      values.officeLocation = { lat, lng };
      // console.log(values , getPCatId);
      // return
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };

        let CheckImageStatus = /^http:\/\//.test(values?.image) && typeof values?.image === 'string' ? true : false;
        // console.log(data, CheckImageStatus);
        // return
        if (!CheckImageStatus) {
          let formimage = new FormData()
          formimage.append('files', values?.image,);
          axios.post(`${base_url}image`, formimage)
            .then(async (response) => {
              // console.log(response.status);
              if (response.status === 200) {
                let updateValue = {
                  ...data,
                  pCatData: {
                    ...data.pCatData,
                    image: `images/${response.data.data.filename}`
                  }
                };
                // console.log(updateValue, 'success');
                // return
                dispatch(updateCompany(updateValue));
                dispatch(resetState());
              }
            })
            .catch((err) => {
              alert("Server Error:", err)
            })
          return
        }
        else {
          const imageName = values.image.match(/\/images\/(.*)$/)[1];
          let updateValue = {
            ...data,
            pCatData: {
              ...data.pCatData,
              image: `images/${imageName}`
            }
          };
          dispatch(updateCompany(updateValue));
          dispatch(resetState());
        }
      } else {

        if (values.image) {

          let formimage = new FormData()
          formimage.append('files', values.image,);

          axios.post(`${base_url}image`, formimage)
            .then(async (data) => {
              if (data.status == 200) {
                let updateValue = {
                  ...values,
                  image: `images/${data.data.data.filename}`
                }
                dispatch(createCompany(updateValue))
                  .then((response) => {
                    if (response?.payload?.response?.status == 400) {
                      alert(response.payload.response.data.message);
                      setLoading(false)
                      return
                    }
                    alert(response?.payload?.msg)
                    formik.resetForm();
                    setTimeout(() => {
                      dispatch(resetState());
                    }, 300);
                  })
                  .catch((error) => {
                    alert("Error creating category:", error)
                    console.error("Error creating category:", error);
                  });
              }
              // if(data?.status == true)
            })
            .catch((err) => {
              alert("Server Error:", err)
            })
          return
        }
        else {
          dispatch(createCompany(values))
            .then((response) => {
              // console.log(response);
              
              if (response?.payload?.status) {
                alert(response.payload.message);
                setLoading(false)
                formik.resetForm();
                setTimeout(() => {
                  dispatch(resetState());
                }, 300);
                return
              }
              else{
                alert(response?.payload)
              }
            })
            .catch((error) => {
              alert("Error creating category:", error)
              console.error("Error creating category:", error);
            });
        }

      }
    },
  });

  const uploadImg = (props) => {
    const image = props[0];
    // console.log(url);
    // return
    setSelectedImage(image);

    // console.log(props);
    formik.setFieldValue('image', image); // Set the selected image to the form field

  }


  return (
    <div>
      <h3 className="mb-4  title">
        {getPCatId !== undefined ? "Edit" : "Add"} Company
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label>Name</label>
            <CustomInput
              type="text"
              label="Enter Company Name"
              onChng={formik.handleChange("name")}
              onBlr={formik.handleBlur("name")}
              val={formik.values.name}
              id="brand"
            />
            <div className="error">
              {formik.touched.name && formik.errors.name}
            </div>
          </div>

          <div className="mb-4">
            <label>Email</label>
            <CustomInput
              type="email"
              label="Enter Company Email"
              onChng={formik.handleChange("email")}
              onBlr={formik.handleBlur("email")}
              val={formik.values.email}
              id="email"
            />
            <div className="error">
              {formik.touched.email && formik.errors.email}
            </div>
          </div>

          <div className="mb-4">
            <label>Password</label>
            <CustomInput
              type="password"
              label="Enter Password"
              onChng={formik.handleChange("password")}
              onBlr={formik.handleBlur("password")}
              val={formik.values.password}
              id="password"
            />
            <div className="error">
              {formik.touched.password && formik.errors.password}
            </div>
          </div>

          <div className="mb-4">
            <label>Company Address</label>
            <CustomInput
              type="text"
              label="Enter Company Address"
              onChng={formik.handleChange("address")}
              onBlr={formik.handleBlur("address")}
              val={formik.values.address}
              id="address"
            />
            <div className="error">
              {formik.touched.address && formik.errors.address}
            </div>
          </div>

          <div className="mb-4">
            <label>Company Location</label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                value={formik.values.officeLocation}
                readOnly
              />
              <button
                type="button"
                className="btn ms-0"
                style={{ backgroundColor: WEB_Color.main, fontSize: 14, color: WEB_Color.white }}
                onClick={() => setMapVisible(true)}
              >
                Pick Location
              </button>
            </div>
            <div className="error">
              {formik.touched.officeLocation && formik.errors.officeLocation}
            </div>
          </div>
          {/* <CustomInput
            type="text"
            label="Enter Company Location"
            onChng={formik.handleChange("officeLocation")}
            onBlr={formik.handleBlur("officeLocation")}
            val={formik.values.officeLocation}
            id="officeLocation"
          />
          <div className="error">
            {formik.touched.officeLocation && formik.errors.officeLocation}
          </div> */}
          <div className="mb-4">
            <label>Area Radius</label>
            <CustomInput
              type="number"
              label="Enter Company radius"
              onChng={formik.handleChange("radius")}
              onBlr={formik.handleBlur("radius")}
              val={formik.values.radius}
              id="radius"
            />
            <div className="error">
              {formik.touched.radius && formik.errors.radius}
            </div>
          </div>
          {/* <CustomInput
            type="text"
            label="Select status"
            onChng={formik.handleChange("status")}
            onBlr={formik.handleBlur("status")}
            val={formik.values.status}
            id="status"
          />
          <div className="error">
            {formik.touched.status && formik.errors.status}
          </div> */}

          {/* Status dropdown */}
          <div className="mb-4">
            <label>Status</label>
            <select
              className="form-select"
              value={formik.values.status}
              onChange={(e) => formik.setFieldValue("status", e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="error">
              {formik.touched.status && formik.errors.status}
            </div>
          </div>


          <div className="bg-white border-1 p-5 text-center" style={{ marginTop: 20 }}>
            <Dropzone onDrop={uploadImg} accept="image/*">
              {({ getRootProps, getInputProps }) => (
                <section style={{ marginTop: 0 }}>
                  {formik.values.image ? (
                    <div onClick={uploadImg}>
                      {
                        formik?.values.image ? (
                          typeof formik.values.image === 'string' && /^https:\/\//.test(formik?.values?.image) ? (
                            // If image URL is from the server
                            <>
                              <h3 style={{ fontSize: 18 }}>Selected Image: {formik?.values?.image.split('/').pop()}</h3>
                              <img
                                src={formik?.values?.image}
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                              />
                            </>
                          ) : (
                            // console.log(formik),

                            // If image is from local storage
                            <>
                              <h3 style={{ fontSize: 18 }}>Selected Image: {formik?.values?.image?.name}</h3>
                              <img
                                src={
                                  typeof formik?.values?.image === 'string'
                                    ? formik.values.image // Use the URL if it's already uploaded
                                    : formik?.values?.image instanceof Blob
                                      ? URL.createObjectURL(formik.values.image) // Use object URL for preview if it's a File object
                                      : ''
                                }
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                              />
                            </>
                          )) : null
                      }
                    </div>
                  ) : (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                  )}
                </section>
              )}
            </Dropzone>
          </div>
          <div className="error">
            {formik.touched.image && formik.errors.image}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} Category
          </button>
        </form>
      </div>


      {/* Map Modal */}
      <MapModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={(coords) => {
          formik.setFieldValue("officeLocation", `${coords.lat},${coords.lng}`);
        }}
      />
    </div>
  );
};

export default AddCompany;
