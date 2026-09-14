import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Bọc quanh 1 nhóm route (dùng làm "element" của <Route>) để:
 * - Chờ AuthProvider khôi phục phiên đăng nhập xong (isLoading) trước khi quyết định
 * - Nếu chưa đăng nhập -> đá về /login, nhớ lại trang muốn vào để quay lại sau khi login
 * - Nếu đã đăng nhập nhưng role không nằm trong allowedRoles -> đá về "/"
 *
 * Dùng: <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}> ... </Route>
 * Không truyền allowedRoles = chỉ cần đăng nhập, không quan tâm role nào.
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#dce3ef] border-t-[#063b91]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
