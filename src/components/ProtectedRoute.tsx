import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role, Session } from "../types";

interface ProtectedRouteProps {
  session: Session;
  allow: Role;
  redirectTo: string;
  children: ReactNode;
}

export default function ProtectedRoute({ session, allow, redirectTo, children }: ProtectedRouteProps) {
  if (!session || session.role !== allow) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
