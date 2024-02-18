import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";
import {
  FiBell,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import Avatar from "@assets/avatar.png";

const Main = ({ auth, removeAuth, handleSetIsSidebarCollapsed }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    privateInstance
      .get("/api/auth/logout")
      .then(function () {
        removeAuth();
        localStorage.removeItem("accessToken");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="main">
      <nav className="navbar navbar-expand navbar-light navbar-bg">
        <a
          className="sidebar-toggle js-sidebar-toggle"
          onClick={() => handleSetIsSidebarCollapsed()}
        >
          <i className="hamburger align-self-center" />
        </a>
        <div className="navbar-collapse collapse">
          <ul className="navbar-nav navbar-align">
            <li className="nav-item dropdown">
              <a className="nav-icon dropdown-toggle" data-bs-toggle="dropdown">
                <div className="position-relative">
                  <FiBell />
                  <span className="indicator">4</span>
                </div>
              </a>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                aria-labelledby="alertsDropdown"
              >
                <div className="dropdown-menu-header">Notifications</div>
                <div className="list-group">
                  <a className="list-group-item">
                    <div className="row g-0 align-items-center">
                      <div className="col-2">
                        <FiBell className="feather" />
                      </div>
                      <div className="col-10">
                        <div className="text-dark">Update completed</div>
                        <div className="text-muted small mt-1">
                          Restart server 12 to complete the update.
                        </div>
                        <div className="text-muted small mt-1">30m ago</div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="dropdown-menu-footer">
                  <a className="text-muted">Show all notifications</a>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-icon dropdown-toggle" data-bs-toggle="dropdown">
                <div className="position-relative">
                  <FiMessageSquare />
                </div>
              </a>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                aria-labelledby="messagesDropdown"
              >
                <div className="dropdown-menu-header">
                  <div className="position-relative">Messages</div>
                </div>
                <div className="list-group">
                  <a className="list-group-item">
                    <div className="row g-0 align-items-center">
                      <div className="col-2">
                        <img
                          src={Avatar}
                          className="avatar img-fluid rounded-circle"
                          alt="Vanessa Tucker"
                        />
                      </div>
                      <div className="col-10 ps-2">
                        <div className="text-dark">Vanessa Tucker</div>
                        <div className="text-muted small mt-1">
                          Nam pretium turpis et arcu. Duis arcu tortor.
                        </div>
                        <div className="text-muted small mt-1">15m ago</div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="dropdown-menu-footer">
                  <a className="text-muted">Show all messages</a>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-icon dropdown-toggle d-inline-block d-sm-none"
                data-bs-toggle="dropdown"
              >
                <FiSettings />
              </a>
              <a
                className="nav-link dropdown-toggle d-none d-sm-inline-block"
                data-bs-toggle="dropdown"
              >
                <img
                  src={Avatar}
                  className="avatar img-fluid rounded me-1"
                  alt={auth.name}
                />
                <span className="text-dark me-1">{auth.name}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item">
                  <FiUser className="feather" />
                  <span className="ms-2">Profile</span>
                </a>

                <button
                  className="dropdown-item"
                  disabled={isLoading}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <FiLogOut className="feather" />
                  <span className="ms-2">Log out</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <main className="content">
        <div className="container-fluid p-0">
          <Suspense fallback={<h1>Loading..</h1>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Main;
