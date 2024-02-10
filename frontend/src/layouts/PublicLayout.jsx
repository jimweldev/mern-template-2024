import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "@components/Loading";

const PublicLayout = () => {
  return (
    <div className="p-5">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default PublicLayout;
