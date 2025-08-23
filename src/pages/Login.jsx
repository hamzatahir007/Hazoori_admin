import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import image from '../assets/hazoorilogo.png'
import axios from "axios";
import { useAuth } from "../constans/store/auth";
import { base_url } from "../utils/baseUrl";
import { WEB_Color } from "../constans/Colors";

let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});
const Login = () => {
  const [isadmin, setIsAdmin] = useState("")
  const dispatch = useDispatch();
  const { storeTokenInLS } = useAuth();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,

    onSubmit: (values) => {
      // console.log(values.email);
      authLoginAdmin(values)
      // dispatch(login(values));
    },
  });

  const authLoginAdmin = (props) => {
    try {
      axios.post(`${base_url}auth/login`, props)
        .then(async (item) => {
          console.log(item.data);
          if (item.data.isAdmin) { // Check if user isAdmin
            // alert('Admin login successfull.');
            storeTokenInLS(item?.data)
            // navigate('admin')
            alert(item.data?.msg)
            setIsAdmin('Accepted')
            window.location.reload();

            return;
          }
          else {
            setIsAdmin('Rejected')
          }
        })
        .catch((e) => {
          if (e.request && e.request.response) {
            let err = JSON.parse(e.request.response);
            alert(err.message);
          } else {
            console.error("Error occurred:", e.message);
            alert(`Error occurred: ${e.message}`);
          }
          // setIsAdmin('Rejected')

          // let err = JSON.parse(e.request.response)
          // alert(err.message)
          // setLoading(false)
          // console.log(JSON.parse(e.request.response));
        })
    } catch (e) {
      console.log(e);
    }
  }
  // const authState = useSelector((state) => state);

  // const { user, isError, isSuccess, isLoading, message } = authState.auth;

  // useEffect(() => {
  //   if (isSuccess) {
  //     navigate("admin");
  //   } else {
  //     navigate("");
  //   }
  // }, [user, isError, isSuccess, isLoading]);
  return (

    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: WEB_Color.main, // use main color for background
      }}
    >
      <div
        className="p-5 shadow-lg rounded-4 bg-white"
        style={{ width: "100%", maxWidth: "400px", borderRadius: 20, }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={image}
            alt="Hazoori Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </div>

        {/* Title */}
        <h3 className="text-center fw-bold mb-2" style={{ color: "#3a7bd5" }}>
          Welcome Back 👋
        </h3>
        <p className="text-center text-muted mb-4">
          Login to your account
        </p>

        {/* Error Message */}
        {isadmin === "Rejected" && (
          <div className="alert alert-danger py-2 text-center">
            You are not an Admin
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <CustomInput
              type="email"
              label="Email Address"
              id="email"
              name="email"
              onChng={formik.handleChange("email")}
              onBlr={formik.handleBlur("email")}
              val={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger small mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CustomInput
              type="password"
              label="Password"
              id="password"
              name="password"
              onChng={formik.handleChange("password")}
              onBlr={formik.handleBlur("password")}
              val={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger small mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Link to="forgot-password" className="text-decoration-none small" style={{ color: "#3a7bd5" }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold text-white py-2"
            style={{
              background: WEB_Color?.main_gradient,
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
