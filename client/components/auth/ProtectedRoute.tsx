import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isReady } = useAuth();

  if (!isReady) {
    return <Navigate to="/splash" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
