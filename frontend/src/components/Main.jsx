import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Avatar from "@assets/avatar.png";

const Main = ({ auth, removeAuth, handleSetIsSidebarCollapsed }) => {
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
                  {/* <FiBell className="feather" /> */}
                  <FontAwesomeIcon icon="fa-regular fa-bell" />
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
                        {/* <FiMessageSquare className="feather" /> */}
                        <FontAwesomeIcon
                          className="feather"
                          icon="fa-solid fa-bell"
                        />
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
                  {/* <FiMessageSquare className="feather" /> */}
                  <FontAwesomeIcon icon="fa-regular fa-message" />
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
                <FontAwesomeIcon icon="fa-solid fa-gear" />
              </a>
              <a
                className="nav-link dropdown-toggle d-none d-sm-inline-block"
                data-bs-toggle="dropdown"
              >
                <img
                  src={Avatar}
                  className="avatar img-fluid rounded me-1"
                  alt={auth.email}
                />
                <span className="text-dark me-1">{auth.email}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item">
                  <FontAwesomeIcon icon="fa-regular fa-user" />
                  <span className="ms-2">Profile</span>
                </a>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    removeAuth();
                    localStorage.removeItem("accessToken");
                  }}
                >
                  <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
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
