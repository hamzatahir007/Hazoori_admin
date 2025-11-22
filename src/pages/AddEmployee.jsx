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
import { createCompany, getCompanies, getCompanyById, updateCompany } from "../features/company/companySlice";
import MapModal from "../components/MapModal";
import { WEB_Color } from "../constans/Colors";
import { useAuth } from "../constans/store/auth";
import { getAllDepartment, getDepartmentById } from "../features/department/departmentSlice";
import { getAllDesignation, getDesignationById } from "../features/designation/designationSlice";
import { getAllShifts, getShiftsByCompany } from "../features/shift/shiftsSlice";
import { createEmployee, getEmployeeById, resetState, updateEmployee } from "../features/employee/employeeSlice";


const AddEmployee = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[2];
  const navigate = useNavigate();

  const { user } = useAuth();


  const shiftState = useSelector((state) => state.shift.shift);
  const companyState = useSelector((state) => state.company.company);
  const newCategory = useSelector((state) => state.company);
  const departmentState = useSelector((state) => state.department.department);
  const designationState = useSelector((state) => state.designation.designation);


  const {
    isSuccess,
    isError,
    isLoading,
    createdCompany,
    companyName,
    updatedCompany,
  } = newCategory;
  // console.log(newCategory);

  let schema = yup.object().shape({
    fullName: yup.string().required("FullName is Required"),
    email: yup.string().required("Email is Required"),
    phone: yup.string().required("Phone is Required"),
    companyId: yup.string().required("Company is Required"),
    address: yup.string().required("Address is Required"),
    designationId: yup.string().required("Designation is Required"),
    departmentId: yup.string().required("Department is Required"),
    shiftId: yup.string().required("Shift is Required"),
    status: yup.string().required("Status is Required"),
    password: getPCatId ? yup.string().min(8, "Minimum 8 characters").nullable()
      : yup.string().required("Password is Required"),
  });


  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getEmployeeById(getPCatId))
        .then((data) => {
          // console.log(data.payload);

          formik.setFieldValue('fullName', data.payload.fullName); // Set the selected image to the form field
          formik.setFieldValue('email', data.payload.email); // Set the selected image to the form field
          formik.setFieldValue('phone', data.payload.phone); // Set the selected image to the form field
          formik.setFieldValue('address', data.payload.address); // Set the selected image to the form field
          formik.setFieldValue('companyId', data.payload.companyId); // Set the selected image to the form field
          formik.setFieldValue('designationId', data.payload.designationId); // Set the selected image to the form field
          formik.setFieldValue('departmentId', data.payload.departmentId); // Set the selected image to the form field
          formik.setFieldValue('shiftId', data.payload.shiftId); // Set the selected image to the form field
          formik.setFieldValue('status', data.payload.status); // Set the selected image to the form field
          // formik.setFieldValue('password', data.payload.password); // Set the selected image to the form field
          formik.setFieldValue('profileImage', data.payload.profileImage ? base_imageurl + data.payload.profileImage : ""); // Set the selected image to the form field
          formik.setFieldValue('faceImage', data.payload.faceImage ? base_imageurl + data.payload.faceImage : null); // Set the selected image to the form field
          formik.setFieldValue('faceVerified', data.payload.faceVerified); // Set the selected image to the form field
        })
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);

  useEffect(() => {
    if (isSuccess && createdCompany) {
      toast.success("Employee Added Successfullly!");
    }
    if (isSuccess && updatedCompany) {
      toast.success("Employee Updated Successfullly!");
      navigate("/admin/list-employee");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);


  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      companyId: "",
      fullName: "",
      address: "",
      email: "",
      phone: "",
      departmentId: "",
      roleId: null,
      designationId: "",
      shiftId: "",
      status: "",
      password: "",
      faceVerified: "",
      profileImage: "", // File or URL
      faceImage: null, // File or URL
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        // setLoading(true);
        // Prepare data payload
        const isUpdate = !!getPCatId;

        const formData = { ...values };

        const isNewImage =
          values.profileImage && typeof values.profileImage !== "string" && !/^http/.test(values.profileImage);


        if (isNewImage) {
          const imageForm = new FormData();
          imageForm.append("files", values.profileImage);

          const imageRes = await axios.post(`${base_url}image`, imageForm);
          if (imageRes.status === 200) {
            formData.profileImage = `images/${imageRes.data.data.filename}`;
          }
        } else if (typeof values.profileImage === "string" && values.profileImage.includes("/images/")) {
          // Extract image path if already exists
          const imageName = values.profileImage.match(/\/images\/(.*)$/)?.[1];
          formData.profileImage = `images/${imageName}`;
        }

        if (isUpdate) {
          // 🔹 UPDATE existing company
          if (!values.password) {
            delete formData.password; // do not send password
          }
          if (!values.profileImage) {
            formData.profileImage = ""; // do not send password
          }
          if (values?.faceImage) {
            const faceimageName = values?.faceImage?.match(/\/images\/(.*)$/)?.[1];
            formData.faceImage = `images/${faceimageName}`;
          }
          if (!values?.faceImage) {
            formData.faceImage = null;
            formData.faceVerified = false;
          }
          // console.log(isNewImage, formData, values);
          // return
          const updatePayload = { id: getPCatId, pCatData: formData };
          // console.log(updatePayload);
          // return;
          const updateRes = await dispatch(updateEmployee(updatePayload));
          if (updateRes?.payload?.status) {
            alert(updateRes.payload.message);
            // ✅ Common reset actions
            formik.resetForm();
            dispatch(resetState());
          } else {
            alert(updateRes?.payload || "Unexpected response from server.");
          }
        } else {
          // 🔹 CREATE new company
          const createRes = await dispatch(createEmployee(formData));

          if (createRes?.payload?.status) {
            alert(createRes.payload.message);
            // ✅ Common reset actions
            formik.resetForm();
            dispatch(resetState());
          } else {
            alert(createRes?.payload || "Unexpected response from server.");
          }
        }


      } catch (error) {
        console.error("Error in form submission:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
  });

  const uploadImg = (props) => {
    // formik.resetForm('profileImage', "");

    // return
    const image = props[0];
    // console.log(props[0]);
    // return
    setSelectedImage(image);
    // console.log(props);
    formik.setFieldValue('profileImage', image); // Set the selected image to the form field
  }


  useEffect(() => {
    dispatch(getCompanies());
    GetDepartment();
    formik.setFieldValue("companyId", user?._id);

  }, [])
  const GetDepartment = () => {
    if (user.isAdmin) {
      dispatch(getAllDepartment());
      dispatch(getAllDesignation());
      dispatch(getAllShifts());

    }
    else {
      dispatch(getDepartmentById(user._id));
      dispatch(getDesignationById(user._id));
      dispatch(getShiftsByCompany(user._id));

    }
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
              label="Enter Full Name"
              onChng={formik.handleChange("fullName")}
              onBlr={formik.handleBlur("fullName")}
              val={formik.values.fullName}
              id="brand"
            />
            <div className="error">
              {formik.touched.fullName && formik.errors.fullName}
            </div>
          </div>

          <div className="mb-4">
            <label>Email</label>
            <CustomInput
              type="email"
              label="Enter Email Address"
              onChng={formik.handleChange("email")}
              onBlr={formik.handleBlur("email")}
              val={formik.values.email}
              id="brand"
            />
            <div className="error">
              {formik.touched.email && formik.errors.email}
            </div>
          </div>

          <div className="mb-4">
            <label>Phone</label>
            <CustomInput
              type="phone"
              label="Enter Phone Number"
              onChng={formik.handleChange("phone")}
              onBlr={formik.handleBlur("phone")}
              val={formik.values.phone}
              id="brand"
            />
            <div className="error">
              {formik.touched.phone && formik.errors.phone}
            </div>
          </div>

          <div className="mb-4">
            <label>Address</label>
            <CustomInput
              type="text"
              label="Enter Address"
              onChng={formik.handleChange("address")}
              onBlr={formik.handleBlur("address")}
              val={formik.values.address}
              id="brand"
            />
            <div className="error">
              {formik.touched.address && formik.errors.address}
            </div>
          </div>

          <div className="mb-4">
            <label>Company</label>
            <select
              className="form-select"
              value={formik.values.companyId}
              onChange={(e) => formik.setFieldValue("companyId", e.target.value)}
            >
              <option value="">Select Company</option>
              {companyState.map(res => {
                return (
                  <option key={res._id} value={res?._id}>{res?.name}</option>
                )
              })}
            </select>
            <div className="error">
              {formik.touched.companyId && formik.errors.companyId}
            </div>
          </div>


          <div className="mb-4">
            <label>Department</label>
            <select
              className="form-select"
              value={formik.values.departmentId}
              onChange={(e) => formik.setFieldValue("departmentId", e.target.value)}
            >
              <option value="">Select Department</option>
              {departmentState.filter(res => res?.companyId == formik?.values?.companyId).map(res => {
                return (
                  <option key={res._id} value={res?._id}>{res?.name}</option>
                )
              })}
            </select>
            <div className="error">
              {formik.touched.departmentId && formik.errors.departmentId}
            </div>
          </div>

          <div className="mb-4">
            <label>Designation</label>
            <select
              className="form-select"
              value={formik.values.designationId}
              onChange={(e) => formik.setFieldValue("designationId", e.target.value)}
            >
              <option value="">Select Designation</option>
              {designationState.filter(res => res?.companyId == formik?.values?.companyId).map(res => {
                return (
                  <option key={res._id} value={res?._id}>{res?.name}</option>
                )
              })}
            </select>
            <div className="error">
              {formik.touched.designationId && formik.errors.designationId}
            </div>
          </div>

          <div className="mb-4">
            <label>Shift</label>
            <select
              className="form-select"
              value={formik.values.shiftId}
              onChange={(e) => formik.setFieldValue("shiftId", e.target.value)}
            >
              <option value="">Select Shift</option>
              {shiftState.filter(res => res?.companyId == formik?.values?.companyId).map(res => {
                return (
                  <option key={res._id} value={res?._id}>{res?.name}</option>
                )
              })}
            </select>
            <div className="error">
              {formik.touched.shiftId && formik.errors.shiftId}
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

          {getPCatId !== undefined && (
            <div>
              {/* Verification Badge */}
              {formik.values.faceVerified && formik?.values.faceImage && (
                <div style={{
                  background: "#e6ffe6",
                  border: "1px solid #28a745",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px"
                }}>
                  <span style={{ fontSize: 20, color: "#28a745" }}>✔</span>
                  <span style={{ fontWeight: "bold", color: "#155724" }}>
                    Account Verified
                  </span>
                </div>
              )}

              {/* Face Image Preview (Read-only) */}
              {formik?.values.faceImage
                && (
                  <div className="bg-white border-1 p-5 text-center position-relative"
                    style={{ marginTop: 20 }} >
                    <button
                      type="button"
                      className="btn btn-danger border-0 rounded-3 position-absolute"
                      style={{ top: 15, right: 15, padding: "5px 10px", fontSize: 12 }}
                      onClick={() => formik.setFieldValue("faceImage", "")}
                    >
                      Reset Image
                    </button>
                    <h5 style={{ fontWeight: 600 }}>Face Image (User Uploaded)</h5>
                    <img
                      src={formik.values.faceImage}
                      alt="Face"
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #ddd",
                        marginTop: 10
                      }}
                    />
                    <p style={{ fontSize: 13, color: "gray", marginTop: 5 }}>
                      *Face image cannot be changed. User uploads this during face scan login.
                    </p>
                  </div>
                )}
            </div>
          )}


          <div className="bg-white border-1 p-5 text-center" style={{ marginTop: 20 }}>
            <Dropzone onDrop={uploadImg} accept="image/*">
              {({ getRootProps, getInputProps }) => (
                <section style={{ marginTop: 0 }}>
                  {formik.values.profileImage ? (
                    <div onClick={uploadImg}>
                      {
                        formik?.values.profileImage ? (
                          typeof formik.values.profileImage === 'string' && /^https:\/\//.test(formik?.values?.profileImage) ? (
                            // If image URL is from the server
                            <>
                              <h3 style={{ fontSize: 18 }}>Selected Image: {formik?.values?.profileImage.split('/').pop()}</h3>
                              <img
                                src={formik?.values?.profileImage}
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                              />
                            </>
                          ) : (
                            // If image is from local storage
                            <>
                              <h3 style={{ fontSize: 18 }}>Selected Image: {formik?.values?.profileImage?.name}</h3>
                              <img
                                src={
                                  typeof formik?.values?.profileImage === 'string'
                                    ? formik.values.profileImage // Use the URL if it's already uploaded
                                    : formik?.values?.profileImage instanceof Blob
                                      ? URL.createObjectURL(formik.values.profileImage) // Use object URL for preview if it's a File object
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
            {formik.touched.profileImage && formik.errors.profileImage}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} Employee
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

export default AddEmployee;
