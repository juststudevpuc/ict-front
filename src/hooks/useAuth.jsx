
import { useSelector } from "react-redux";

export function useAuth() {
  const user = useSelector((state) => state.user);
  const loading = false; // you can add a flag if needed
  return { user, loading };
}