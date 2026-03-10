// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// export default function ProtectedRoute({ children, role }) {
//   const { user, loading } = useAuth();

//   console.log("User object:", user); // ✅ debug
//   console.log("User role:", user?.role);

//   if (loading) return <div>Loading...</div>;
//   if (!user || user.role !== role) return <Navigate to="/auth/login" replace />;

//   return children;
// }
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // If there is no user, OR the user doesn't have the right role
  if (!user || user.role !== role) {
    // Determine the correct login page based on the role they are trying to access
    const loginPath = role === "admin" ? "/admin/login" : "/auth/login";
    
    // Redirect them, but save where they were trying to go!
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}