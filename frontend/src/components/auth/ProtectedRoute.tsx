import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Có thể xảy ra khi refresh trang
        if (!accessToken) {
          await refresh();
        }

        // Lấy accessToken mới nhất từ store sau khi refresh
        const currentToken = useAuthStore.getState().accessToken;

        if (currentToken && !user) {
          await fetchMe();
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        // ✅ setState trong finally của async function là OK
        setIsInitialized(true);
      }
    };

    init();
  }, []); // Empty dependency array - chỉ chạy 1 lần

  // Hiển thị loading khi đang khởi tạo hoặc đang load
  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  // Redirect nếu không có token sau khi init xong
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
