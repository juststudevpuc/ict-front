import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  console.log("User object:", user); // ✅ debug
  console.log("User role:", user?.role);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== role) return <Navigate to="/auth/login" replace />;

  return children;
}
