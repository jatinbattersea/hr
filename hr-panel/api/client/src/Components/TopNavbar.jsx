import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';
import ProfileImage from './../Public/images/dummy-image.jpg';

const TopNavbar = (props) => {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const toggleSidebar = () => {
      props.sideBar ? props.setSideBar(false) : props.setSideBar(true)
    }
    
    //  Handle Logout
    const handleLogout = (event) => {
        event.preventDefault();
        Cookies.remove('userJwt', { path: '/' }) // removed!
        navigate('/accounts/login', { replace: true });
    }

  return (
      <>
          <header id="header" className="header fixed-top d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-between">
                  <NavLink to="/" className="logo d-flex align-items-center">
                      <img src="/assets/img/logo.png" alt="" />
                  </NavLink>
                  <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
              </div>
              <div className="search-bar">
                  <form className="search-form d-flex align-items-center" method="POST" action="#">
                      <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                  </form>
              </div>
              <nav className="header-nav ms-auto">
                  <ul className="d-flex align-items-center">
                      <li className="nav-item d-block d-lg-none">
                          <a className="nav-link nav-icon search-bar-toggle " href="#">
                              <i className="bi bi-search"></i>
                          </a>
                      </li>
                      <li className="nav-item dropdown pe-3">
                          <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                              <img src={(user._doc.profileImage != "") ? (`http://localhost:5000/api/images/` + user._doc.profileImage) : (ProfileImage)} alt="Profile" className="rounded-circle" />
                              <span className="d-none d-md-block dropdown-toggle ps-2">{ user._doc.name || "user" }</span>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                              <li className="dropdown-header">
                                  <h6>{user._doc.name || "user"}</h6>
                                  <span>{ "Battersea " + user._doc.designation || "designation"}</span>
                              </li>
                              <li>
                                  <hr className="dropdown-divider" />
                              </li>
                              <li>
                                  <NavLink to="/profile" className="dropdown-item d-flex align-items-center">
                                      <i className="bi bi-person"></i>
                                      <span>Profile</span>
                                  </NavLink>
                              </li>
                              <li>
                                  <hr className="dropdown-divider" />
                              </li>
                              <li>
                                  <a className="dropdown-item d-flex align-items-center" href="#" onClick={handleLogout}>
                                      <i className="bi bi-box-arrow-right"></i>
                                      <span>Sign Out</span>
                                  </a>
                              </li>
                          </ul>
                      </li>
                  </ul>
              </nav>
          </header>
      </>
  )
}

export default TopNavbar;