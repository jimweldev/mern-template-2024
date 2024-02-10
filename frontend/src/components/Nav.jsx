import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Nav = ({ auth, isSidebarCollapsed }) => {
  return (
    <nav className={`sidebar js-sidebar ${isSidebarCollapsed && "collapsed"}`}>
      <div className="sidebar-content js-simplebar">
        <Link className="sidebar-brand text-center" to="/">
          <span className="align-middle">{import.meta.env.VITE_APP_TITLE}</span>
        </Link>
        <ul className="sidebar-nav">
          {/* <li className="sidebar-header">Pages</li> */}
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/">
              <FontAwesomeIcon
                className="feather align-middle"
                icon="fa-solid fa-home"
              />
              <span className="align-middle">
                {auth.isAdmin ? "Admin" : "Home"}
              </span>
            </NavLink>
          </li>
          {auth.isAdmin && (
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/home">
                <FontAwesomeIcon
                  className="feather align-middle"
                  icon="fa-solid fa-home"
                />
                Home
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
