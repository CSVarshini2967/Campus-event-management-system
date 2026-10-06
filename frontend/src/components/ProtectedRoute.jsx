import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) window.history.replaceState({}, "", "/login");
  }, [isAuthenticated]);
  return isAuthenticated ? children : null;
}
