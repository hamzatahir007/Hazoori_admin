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

function App() {
  const { user, LogOutUser } = useAuth();
  const [loggedIn, setLoggedIn] = useState(user ? true : false); // Track login status
  console.log(loggedIn, user);

  const handleLoginSuccess = () => {
    // Navigate to admin page
    setLoggedIn(true); // Update login status
  };

  return (
    <Router>
      <Routes>
        {!user ?
          <>
            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/reset-password" element={<Resetpassword />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            {/* <Route path="/admin/*" element={<Navigate to="/" />} /> */}
          </>
          :
          <>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="list-company" element={<Companylist />} />
              <Route path="company" element={<AddCompany />} />
              <Route path="company/:id" element={<AddCompany />} />
              {/* <Route path="enquiries" element={<Enquiries />} />
              <Route path="enquiries/:id" element={<ViewEnq />} />
              <Route path="blog-list" element={<Bloglist />} />
              <Route path="blog" element={<Addblog />} />
              <Route path="blog/:id" element={<Addblog />} />
              <Route path="coupon-list" element={<Couponlist />} />
              <Route path="coupon" element={<AddCoupon />} />
              <Route path="coupon/:id" element={<AddCoupon />} />
              <Route path="blog-category-list" element={<Blogcatlist />} />
              <Route path="blog-category" element={<Addblogcat />} />
              <Route path="blog-category/:id" element={<Addblogcat />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order/:id" element={<ViewOrder />} />
              <Route path="customers" element={<Customers />} />
              <Route path="list-color" element={<Colorlist />} />
              <Route path="color" element={<Addcolor />} />
              <Route path="color/:id" element={<Addcolor />} />
              <Route path="list-category" element={<Categorylist />} />
              <Route path="category" element={<Addcat />} />
              <Route path="category/:id" element={<Addcat />} />
              <Route path="list-brand" element={<Brandlist />} />
              <Route path="brand" element={<Addbrand />} />
              <Route path="brand/:id" element={<Addbrand />} />
              <Route path="list-product" element={<Productlist />} />
              <Route path="product" element={<Addproduct />} />
              <Route path="product/:id" element={<Addproduct />} /> */}
            </Route>
          </>
        }
        {!user && <Route path="/admin/*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  )
}

export default App
