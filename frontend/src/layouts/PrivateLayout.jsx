import React, { Suspense, useState } from "react";

// stores
import useAuthStore from "@store/authStore";
import Main from "@components/Main";
import Nav from "@components/Nav";

const PrivateLayout = () => {
  const { auth, removeAuth } = useAuthStore((state) => ({
    auth: state.auth,
    removeAuth: state.removeAuth,
  }));

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSetIsSidebarCollapsed = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="wrapper">
      {/* nav */}
      <Nav auth={auth} isSidebarCollapsed={isSidebarCollapsed} />
      {/* main */}
      <Main
        auth={auth}
        removeAuth={removeAuth}
        handleSetIsSidebarCollapsed={handleSetIsSidebarCollapsed}
      />
    </div>
  );
};

export default PrivateLayout;
