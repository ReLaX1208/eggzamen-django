import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Обёртка для защищённых страниц
 * Если пользователь не авторизован → редирект на /login
 */
export default function RequireAuth({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
