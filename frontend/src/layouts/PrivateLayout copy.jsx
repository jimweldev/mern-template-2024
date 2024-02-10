import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "@components/Loading";

// stores
import useAuthStore from "@store/authStore";

const PrivateLayout = () => {
  const { auth, removeAuth } = useAuthStore((state) => ({
    auth: state.auth,
    removeAuth: state.removeAuth,
  }));

  return (
    <div>
      <h1>Private Layout</h1>
      <button
        onClick={() => {
          removeAuth();
          localStorage.removeItem("accessToken");
        }}
      >
        logout
      </button>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default PrivateLayout;
