import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import { toast } from "react-toastify";
import { deleteCompany, getCompanies } from "../features/company/companySlice";
import { useAuth } from "../constans/store/auth";
import { deleteEmployee, getEmployees, getEmployeesByCompany } from "../features/employee/employeeSlice";
import { getAllShifts, getShiftsByCompany } from "../features/shift/shiftsSlice";
import { getAllDesignation, getDesignationById } from "../features/designation/designationSlice";
import { getAllDepartment, getDepartmentById } from "../features/department/departmentSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Company",
    dataIndex: "companyId",
  },
  {
    title: "Department",
    dataIndex: "departmentId",
    sorter: (a, b) => a.radius - b.radius,
  },
  {
    title: "Designation",
    dataIndex: "designationId",
  },
  {
    title: "Shift",
    dataIndex: "shiftId",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Employeelist = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [cId, setCId] = useState("");

  const shiftState = useSelector((state) => state.shift.shift);
  const companyState = useSelector((state) => state.company.company);
  const employeeState = useSelector((state) => state.employee.employee);
  const departmentState = useSelector((state) => state.department.department);
  const designationState = useSelector((state) => state.designation.designation);

  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, deletedProduct } = newProduct;
  const { user } = useAuth();


  useEffect(() => {
    if (isSuccess && deletedProduct) {
      toast.success("Company Deleted Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);


  const hideModal = () => {
    setOpen(false);
  };


  const showModal = (e) => {
    setOpen(true);
    setCId(e);
  };


  useEffect(() => {
    GetEmployees();
    dispatch(getCompanies());
  }, []);


  const GetEmployees = () => {
    if (user.isAdmin) {
      dispatch(getAllDepartment());
      dispatch(getAllDesignation());
      dispatch(getAllShifts());
      dispatch(getEmployees(user));
    }
    else {
      dispatch(getDepartmentById(user._id));
      dispatch(getDesignationById(user._id));
      dispatch(getShiftsByCompany(user._id));
      dispatch(getEmployeesByCompany(user._id));
    }
  }

  const data1 = [];
  for (let i = 0; i < employeeState?.length; i++) {
    data1.push({
      key: i + 1,
      fullName: employeeState[i].fullName.split(" ")[0],
      phone: employeeState[i].phone,
      companyId: companyState?.length > 0 && companyState?.find(res => res._id === employeeState[i].companyId)?.name ? companyState?.find(res => res._id === employeeState[i].companyId)?.name?.split(" ")[0] : 'Unknow',
      departmentId: departmentState?.length > 0 && departmentState?.find(res => res._id === employeeState[i].departmentId)?.name ? departmentState?.find(res => res._id === employeeState[i].departmentId)?.name?.split(" ")[0] : employeeState[i].departmentId,
      designationId: designationState?.length > 0 && designationState?.find(res => res._id === employeeState[i].designationId)?.name ? designationState?.find(res => res._id === employeeState[i].designationId)?.name?.split(" ")[0] : `${employeeState[i].designationId}`,
      shiftId: shiftState?.length > 0 && shiftState?.find(res => res._id === employeeState[i].shiftId)?.name ? shiftState?.find(res => res._id === employeeState[i].shiftId)?.name?.split(" ")[0] : `${employeeState[i].shiftId}`,
      status: `${employeeState[i].status}`,
      action: (
        <>
          <Link
            to={`/employee/${employeeState[i]._id}`}
            className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(employeeState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }


  const deleteProduct = (e) => {
    dispatch(deleteEmployee(e))
      .unwrap()              // <--- Makes .then work properly
      .then((res) => {
        // console.log(res.data);
        alert(res.message);
        GetEmployees()   // fresh data
      })
      .catch((err) => {
        console.log("Delete error:", err);
      });
    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Employees</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>

      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(cId);
        }}
        title="Are you sure you want to delete this Employee?"
      />
    </div>
  );
};

export default Employeelist;
