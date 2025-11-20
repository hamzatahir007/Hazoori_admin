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
import { createNewShift, getShiftById, getShiftsByCompany, updateShift } from "../features/shift/shiftsSlice";


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
  // const designationState = useSelector((state) => state.designation);
    const shiftState = useSelector((state) => state.shift);
  
  const {
    isSuccess,
    isError,
    isLoading,
    createdShift,
    updatedShift,
  } = shiftState;



  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(getCompanies());

      formik.setFieldValue("companyId", user?._id);
    }
  }, [user]);

  let schema = yup.object().shape({
    name: yup.string().required("Shift Name is required"),
    duration: yup.string().required("duration  is Required"),
    companyId: yup
      .string()
      .required("Company is required")
      .min(5, "Invalid company"),
    startTime: yup.string().required("startTime  is Required"),
    endTime: yup.string().required("endTime  is Required"),
  });

  const calculateEndTime = (startTime, hours) => {
    if (!startTime || !hours) return "";

    // startTime = "09:00"
    const [h, m] = startTime.split(":").map(Number);

    let totalMinutes = h * 60 + m + Number(hours) * 60;

    // wrap around 24 hours (optional)
    totalMinutes = totalMinutes % (24 * 60);

    const endH = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const endM = String(totalMinutes % 60).padStart(2, "0");

    return `${endH}:${endM}`;
  };


  useEffect(() => {
    if (editId !== undefined) {

      dispatch(getShiftById(editId))
        .then((data) => {

          formik.setValues({
            name: data.payload.name,
            duration: data.payload.duration,
            companyId: data.payload.companyId,
            startTime: data.payload.startTime,
            endTime: data.payload.endTime,
          });

        })
    } else {
      dispatch(resetState());
    }
  }, [editId]);

  useEffect(() => {
    if (isSuccess && createdShift) {
      toast.success("Shift Added Successfullly!");
    }
    if (isSuccess && updatedShift) {
      toast.success("Shift Updated Successfullly!");
      navigate("/admin/list-shift");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);


  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      duration: "",
      companyId: "",
      startTime: "",
      endTime: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {

     try {
        // setLoading(true);
        if (editId) {
          const updatePayload = { id: editId, data: values };


          const updateRes = await dispatch(updateShift(updatePayload));
          if (updateRes?.payload?.status) {
            alert(updateRes.payload.message);
            // ✅ Common reset actions
            formik.resetForm();
            dispatch(resetState());
          } else {
            alert(updateRes?.payload || "Unexpected response from server.");
          }
        } else {

          const createRes = await dispatch(createNewShift(values));

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

  useEffect(() => {
    const { startTime, duration } = formik.values;

    if (startTime && duration) {
      const end = calculateEndTime(startTime, duration);
      if (end) {
        formik.setFieldValue("endTime", end);
      }
    }
  }, [formik.values.startTime, formik.values.duration]);


  const DurationState = [
    {
      id: 1,
      name: '2hr',
      value: 2,
    },
    {
      id: 2,
      name: '9hr',
      value: 9,
    },
    {
      id: 3,
      name: '12hr',
      value: 12,
    },
    {
      id: 4,
      name: '24hr',
      value: 24,
    },
  ]


  return (
    <div>
      <h3 className="mb-4  title">
        {editId !== undefined ? "Edit" : "Add"} Shift
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label>Name</label>
            <CustomInput
              type="text"
              label="Enter shift title"
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
            <label>Duration</label>
            <select
              className="form-select"
              value={formik.values.duration}
              onChange={(e) => formik.setFieldValue("duration", e.target.value)}
            >
              <option value="">Select Duration</option>
              {DurationState.map(res => {
                return (
                  <option key={res._id} value={res?.value}>{res?.name}</option>
                )
              })}
            </select>
            <div className="error">
              {formik.touched.duration && formik.errors.duration}
            </div>
          </div>

          <div className="mb-4">
            <label>Start Time</label>
            <CustomInput
              type="time"
              label="Select start time"
              onChng={formik.handleChange("startTime")}
              onBlr={formik.handleBlur("startTime")}
              val={formik.values.startTime}
              id="brand"
            />
            <div className="error">
              {formik.touched.startTime && formik.errors.startTime}
            </div>
          </div>

          <div className="mb-4">
            <label>End Time</label>
            <CustomInput
              type="time"
              label="End time (auto calculated)"
              onChng={formik.handleChange("endTime")}
              onBlr={formik.handleBlur("endTime")}
              val={formik.values.endTime}
              id="brand"
              disabled={true}
            />
            <div className="error">
              {formik.touched.endTime && formik.errors.endTime}
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
