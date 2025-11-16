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
import { deleteDesignation, getAllDesignation, getDesignationById } from "../features/designation/designationSlice";

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

const Shiftlist = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [cId, setCId] = useState("");
  const designationState = useSelector((state) => state.designation.designation);
  const deleteddesignationState = useSelector((state) => state.designation);
  const companyState = useSelector((state) => state.company.company);

  // const { isSuccess, isError, isLoading } = departmentState;
  const { isSuccess, isError, isLoading,  deletedDesignation } = deleteddesignationState;


  const { user } = useAuth();

  useEffect(() => {
    if (isSuccess && deletedDesignation) {
      toast.success("Designation Deleted Successfullly!");
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

    GetDesignation();
    dispatch(getCompanies());

  }, []);

  const GetDesignation = () => {
    if (user.isAdmin) {
      dispatch(getAllDesignation());
    }
    else {
      dispatch(getDesignationById(user._id));
    }
  }


  const data1 = [];
  for (let i = 0; i < designationState.length; i++) {
    data1.push({
      key: i + 1,
      name: designationState[i].name,
      description: designationState[i].description,
      companyId: companyState?.length > 0 ? companyState?.find(res => res._id === designationState[i].companyId).name : designationState[i].companyId,
      action: (
        <>
          <Link
            to={`/department/${designationState[i]._id}`}
            className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(designationState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }


  const deleteProduct = (e) => {
    dispatch(deleteDesignation(e))
      .unwrap()
      .then(() => {
        GetDesignation();
      })
      .catch((err) => {
        console.log("Delete error:", err);
      });
    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Designations</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>

      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(cId);
        }}
        title="Are you sure you want to delete this Designation?"
      />
    </div>
  );
};

export default Shiftlist;
