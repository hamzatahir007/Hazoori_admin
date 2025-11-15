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
import { deleteDepartment, getAllDepartment, getDepartmentById } from "../features/department/departmentSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Company",
    dataIndex: "companyId",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Departmentlist = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [cId, setCId] = useState("");
  const departmentState = useSelector((state) => state.department.department);
  const deletedDepartmentState = useSelector((state) => state.department);
  const companyState = useSelector((state) => state.company.company);

  // const { isSuccess, isError, isLoading } = departmentState;
  const { isSuccess, isError, isLoading, deletedDepartment } = deletedDepartmentState;


  const { user } = useAuth();

  useEffect(() => {
    if (isSuccess && deletedDepartment) {
      toast.success("Department Deleted Successfullly!");
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

    GetDepartment();
    dispatch(getCompanies());

  }, []);

  const GetDepartment = () => {
    if (user.isAdmin) {
      dispatch(getAllDepartment());
    }
    else {
      dispatch(getDepartmentById(user._id));
    }
  }


  const data1 = [];
  for (let i = 0; i < departmentState.length; i++) {
    data1.push({
      key: i + 1,
      name: departmentState[i].name,
      description: departmentState[i].description,
      companyId: companyState?.length > 0 ? companyState?.find(res => res._id === departmentState[i].companyId).name : departmentState[i].companyId,
      action: (
        <>
          <Link
            to={`/department/${departmentState[i]._id}`}
            className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(departmentState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }


  const deleteProduct = (e) => {
    dispatch(deleteDepartment(e))
      .unwrap()
      .then(() => {
        GetDepartment();
      })
      .catch((err) => {
        console.log("Delete error:", err);
      });
    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Departments</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>

      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(cId);
        }}
        title="Are you sure you want to delete this Department?"
      />
    </div>
  );
};

export default Departmentlist;
