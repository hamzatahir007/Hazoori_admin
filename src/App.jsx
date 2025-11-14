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

function App() {
  const { user, LogOutUser } = useAuth();
  console.log(user , 'pp');


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
          </Route>
        }

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router >
  )
}

export default App
