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
import { getCompanies } from "../features/company/companySlice";
import MapModal from "../components/MapModal";
import { WEB_Color } from "../constans/Colors";
import { useAuth } from "../constans/store/auth";
import { createNewDesignation, getDesignation, updateDesignation, resetState } from "../features/designation/designationSlice";


const AddShift = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const editId = location.pathname.split("/")[2];

  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const companyState = useSelector((state) => state.company.company);
  const designationState = useSelector((state) => state.designation);
  const {
    isSuccess,
    isError,
    isLoading,
    createdDesignation,
    updatedDesignation,
  } = designationState;



  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(getCompanies());

      formik.setFieldValue("companyId", user?._id);
    }
  }, [user]);

  let schema = yup.object().shape({
    name: yup.string().required("Designation Name is required"),
    description: yup.string().required("Description  is Required"),
    companyId: yup
      .string()
      .required("Company is required")
      .min(5, "Invalid company"),
  });


  useEffect(() => {
    if (editId !== undefined) {

      dispatch(getDesignation(editId))
        .then((data) => {

          formik.setValues({
            name: data.payload.name,
            description: data.payload.description,
            companyId: data.payload.companyId,
          });

        })
    } else {
      dispatch(resetState());
    }
  }, [editId]);

  useEffect(() => {
    if (isSuccess && createdDesignation) {
      toast.success("Designation Added Successfullly!");
    }
    if (isSuccess && updatedDesignation) {
      toast.success("Designation Updated Successfullly!");
      navigate("/admin/list-designation");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);


  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      companyId: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        // setLoading(true);
        if (editId) {
          const updatePayload = { id: editId, data: values };


          const updateRes = await dispatch(updateDesignation(updatePayload));
          if (updateRes?.payload?.status) {
            alert(updateRes.payload.message);
            // ✅ Common reset actions
            formik.resetForm();
            dispatch(resetState());
          } else {
            alert(updateRes?.payload || "Unexpected response from server.");
          }
        } else {

          const createRes = await dispatch(createNewDesignation(values));

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



  return (
    <div>
      <h3 className="mb-4  title">
        {editId !== undefined ? "Edit" : "Add"} Designation
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label>Name</label>
            <CustomInput
              type="text"
              label="Enter designation title"
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
            <label>Description</label>
            <textarea
              className="form-control"
              placeholder="Enter designation description"
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={4} // adjust height
            />
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          {user?.isAdmin && companyState?.length > 0 &&
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
          }

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {editId !== undefined ? "Edit" : "Add"} Designation
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

export default AddShift;
