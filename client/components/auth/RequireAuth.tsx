import { ReactNode } from "react";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default RequireAuth;
