import React, { lazy } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

// stores
import useAuthStore from "@store/authStore";

// layouts
import PublicLayout from "@layouts/PublicLayout";
import PrivateLayout from "@layouts/PrivateLayout";

// pages
// public
import Login from "@pages/public/Login";

// private
import Home from "@pages/private/home/Home";
import Admin from "@pages/private/admin/Admin";
// const Home = lazy(() => import("@pages/private/Home"));

const App = () => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth,
  }));

  return (
    <Routes>
      {auth ? (
        <Route path="/*" element={<PrivateRoutes auth={auth} />} />
      ) : (
        <Route path="/*" element={<PublicRoutes />} />
      )}
    </Routes>
  );
};

export default App;

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const PrivateRoutes = ({ auth }) => {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path="/" element={auth?.isAdmin ? <Admin /> : <Home />} />
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
