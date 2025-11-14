// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../constans/store/auth";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  console.log(user , 'user');
  
  return user ? children : <Navigate to="/login" />;
}
