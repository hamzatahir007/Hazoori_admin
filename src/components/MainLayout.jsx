import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
  AiOutlineHome,
  AiOutlineUserAdd,
  AiOutlineUnorderedList,
  AiOutlineCheckSquare,
  AiOutlineBarChart,
  AiOutlineSetting,
} from "react-icons/ai";
import image from '../assets/hazoorilogo.png'
import { RiCouponLine, RiUserSettingsLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import '../index.css'
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../constans/store/auth";
import { WEB_Color } from "../constans/Colors";
import { MdAccessTime, MdOutlineWbSunny, MdSunny } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { base_imageurl, base_url } from "../utils/baseUrl";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkTheme, setdarkTheme] = useState(false);
  const [userData, setUserData] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const { user, LogOutUser } = useAuth();
  // const { LogOutUser } = useAuth();
  const location = useLocation();

  const OnLogout = async () => {
    // navigate('/')
    await LogOutUser();
    window.location.reload();
    // console.log('yes');
    // console.log(user);
  }

  useEffect(() => {
    if (user) {
      setUserData(user)
      // navigate('/')
    }
  }, [user])

  const pathSnippets = location.pathname.split("/").filter(i => i);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home" onClick={() => navigate("/")}>
      Dashboard
    </Breadcrumb.Item>,
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={url} onClick={() => navigate(url)}>
          {snippet.charAt(0).toUpperCase() + snippet.slice(1)} {/* Capitalize */}
        </Breadcrumb.Item>
      );
    }),
  ];


  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ backgroundColor: WEB_Color.transparent, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70px', borderBottom: '.5px solid', borderColor: WEB_Color.gray }}>
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <img src={image} alt="Description of the image" style={{ width: '70%', height: 'auto' }} />
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key == "signout") {
              navigate('./login');
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "/",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "companies",
              icon: <AiOutlineHome className="fs-4" />,
              label: "Companies",
              children: [
                {
                  key: "company",
                  icon: <AiOutlineHome className="fs-4" />,
                  label: "Add Company",
                },
                {
                  key: "list-company",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Company List",
                },
              ],
            },
            {
              key: "employees",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Employees",
              children: [
                {
                  key: "add-employee",
                  icon: <AiOutlineUserAdd className="fs-4" />,
                  label: "Add Employee",
                },
                {
                  key: "list-employee",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Employee List",
                },
              ],
            },
            {
              key: "attendance",
              icon: <FaClipboardList className="fs-4" />,
              label: "Attendance",
              children: [
                {
                  key: "mark-attendance",
                  icon: <AiOutlineCheckSquare className="fs-4" />,
                  label: "Mark Attendance",
                },
                {
                  key: "attendance-list",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Attendance Records",
                },
                {
                  key: "attendance-report",
                  icon: <AiOutlineBarChart className="fs-4" />,
                  label: "Reports",
                },
              ],
            },
            {
              key: "departments",
              icon: <BiCategoryAlt className="fs-4" />,
              label: "Departments",
              children: [
                {
                  key: "add-department",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Add Department",
                },
                {
                  key: "list-department",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Department List",
                },
              ],
            },
            {
              key: "designations",
              icon: <BiCategoryAlt className="fs-4" />,
              label: "Designations",
              children: [
                {
                  key: "add-designation",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Add Designation",
                },
                {
                  key: "list-designation",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Designation List",
                },
              ],
            },
            {
              key: "shifts",
              icon: <MdAccessTime className="fs-4" />,
              label: "Shifts",
              children: [
                {
                  key: "add-shift",
                  icon: <MdAccessTime className="fs-4" />,
                  label: "Add Shift",
                },
                {
                  key: "list-shift",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Shift List",
                },
              ],
            },
            {
              key: "roles",
              icon: <RiUserSettingsLine className="fs-4" />,
              label: "Roles & Permissions",
              children: [
                {
                  key: "add-role",
                  icon: <RiUserSettingsLine className="fs-4" />,
                  label: "Add Role",
                },
                {
                  key: "list-role",
                  icon: <AiOutlineUnorderedList className="fs-4" />,
                  label: "Role List",
                },
              ],
            },
            {
              key: "reports",
              icon: <AiOutlineBarChart className="fs-4" />,
              label: "Analytics & Reports",
            },
            {
              key: "settings",
              icon: <AiOutlineSetting className="fs-4" />,
              label: "Settings",
            },
          ].filter(res => !user?.isAdmin ? res.key != 'companies' : res.key)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {React.createElement(
              collapsed ? MenuOutlined : MenuOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          </div>

          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <GoBell className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div>
            <div className="position-relative">
              {darkTheme ?
                <MdSunny className="fs-4" onClick={() => setdarkTheme(!darkTheme)} />
                :
                <MdOutlineWbSunny className="fs-4" onClick={() => setdarkTheme(!darkTheme)} />
              }
            </div>


            {userData ?
              <div className="d-flex gap-3 align-items-center dropdown">
                <div
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img
                    src={
                      typeof user?.image === 'string' && user?.image
                        ? `${base_imageurl}${user?.image}` // Use the URL if it's already uploaded
                        : "https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                    }
                    width={35}
                    height={35}
                    alt=""
                    style={{
                      borderRadius: 50,
                    }}
                  />
                </div>
                {/* <div
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h5 className="mb-0">{userData.username}</h5>
                  <p className="mb-0">{userData.email}</p>
                </div> */}
                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <Link
                      className="dropdown-item py-1 mb-1"
                      style={{ height: "auto", lineHeight: "20px" }}
                      to="/"
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-1 mb-1"
                      style={{ height: "auto", lineHeight: "20px" }}
                      onClick={() => OnLogout()}
                    >
                      Signout
                    </Link>
                  </li>
                </div>
              </div> :
              <div className="d-flex gap-3 align-items-center dropdown">
                <Link
                  className="dropdown-item py-1 mb-1"
                  style={{ height: "auto", lineHeight: "20px" }}
                  to="/"
                >
                  Login
                </Link>
              </div>
            }
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
