import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROUTES } from "@/constants/routes";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isReady, user } = useAuth();

  if (!isReady || !user) {
    return <Navigate to={ROUTES.SPLASH} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
