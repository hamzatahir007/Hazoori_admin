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
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Radius",
    dataIndex: "radius",
    sorter: (a, b) => a.radius - b.radius,
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
    dispatch(getCompanies(user));
  }, []);

  const companyState = useSelector((state) => state.company.company);



  const data1 = [];
  for (let i = 0; i < companyState.length; i++) {
    data1.push({
      key: i + 1,
      name: companyState[i].name,
      description: companyState[i].description,
      email: companyState[i].email,
      address: companyState[i].address,
      radius: `${companyState[i].radius}`,
      status: `${companyState[i].status}`,
      action: (
        <>
          <Link
            to={`/company/${companyState[i]._id}`}
            className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(companyState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }


  const deleteProduct = (e) => {
    dispatch(deleteCompany(e))
      .unwrap()              // <--- Makes .then work properly
      .then(() => {
        dispatch(getCompanies(user));   // fresh data
      })
      .catch((err) => {
        console.log("Delete error:", err);
      });
    setOpen(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>

      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(cId);
        }}
        title="Are you sure you want to delete this Company?"
      />
    </div>
  );
};

export default Employeelist;
