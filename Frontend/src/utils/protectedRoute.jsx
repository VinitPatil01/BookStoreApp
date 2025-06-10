import { Navigate } from "react-router-dom";
import { getUserRole } from "./auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;