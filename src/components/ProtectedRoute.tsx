import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation("common");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-editor font-mono text-dimmed">
        <span className="animate-pulse text-neon">{t("protected.authenticating")}</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
