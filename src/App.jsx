import { useState } from 'react'
import './App.css'
import { useAuth } from './constans/store/auth';
import Login from "./pages/Login.jsx";
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Resetpassword from './pages/Resetpassword.jsx';
import Forgotpassword from './pages/Forgotpassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddCompany from './pages/AddCompany.jsx';
import Companylist from './pages/CompanyList.jsx';
import PrivateRoute from "./components/PrivateRoute";
import AddDepartment from './pages/AddDepartment.jsx';
import Departmentlist from './pages/Departmentlist.jsx';
import Designationlist from './pages/Designationlist.jsx';
import AddDesignation from './pages/AddDesignation.jsx';
import Shiftlist from './pages/Shiftlist.jsx';
import AddShift from './pages/AddShift.jsx';

function App() {
  const { user, LogOutUser } = useAuth();


  return (
    <Router >
      <Routes>
        {!user ?
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<Resetpassword />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
          :

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="list-company" element={<Companylist />} />
            <Route path="company" element={<AddCompany />} />
            <Route path="company/:id" element={<AddCompany />} />
            <Route path="list-department" element={<Departmentlist />} />
            <Route path="department" element={<AddDepartment />} />
            <Route path="department/:id" element={<AddDepartment />} />
            <Route path="list-designation" element={<Designationlist />} />
            <Route path="designation" element={<AddDesignation />} />
            <Route path="designation/:id" element={<AddDesignation />} />
            <Route path="list-shift" element={<Shiftlist />} />
            <Route path="shift" element={<AddShift />} />
            <Route path="shift/:id" element={<AddShift />} />
            <Route path="*" element={<Navigate to="/" />} />

          </Route>
        }

        {/* <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} /> */}
      </Routes>
    </Router >
  )
}

export default App
