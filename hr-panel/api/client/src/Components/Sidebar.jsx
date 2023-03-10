import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {

    const { user } = useContext(AuthContext);

    const authorizedPages = user.authorizedPages;

    const paths = {
        "": {
            value: "Dashboard",
            icon: "bi-grid",
        },
        "employees": {
            value: "All Employees",
            icon: "bi-person",
        },
        "add-member": {
            value: "Add Employee",
            icon: "bi-plus-circle"
        },
        "add-shift": {
            value: "Add Shift",
            icon: "bi-clock-history"
        },
        "attendence": {
            value: "Attendance",
            icon: "bi-person-check"
        },
        "holidays": {
            value: "Holidays",
            icon: "bi-calendar-check"
        },
        "teams": {
            value: "Teams",
            icon: "bi-microsoft-teams"
        },
        "performance": {
            value: "Performance",
            icon: "bi-file-earmark-bar-graph",
        },
        "settings": {
            value: "settings",
            icon: "bi-gear",
        }
    }

    const [pathName, setPathName] = useState();

    useEffect(() => {
        setPathName(window.location.pathname.split('/')[1]);
    }, [window.location.pathname])

    return (
        <>
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    {
                        authorizedPages.map((page) => (
                            paths[page.split('/')[1]] &&
                            <li className="nav-item" key={page}>
                                <NavLink to={page} className={(pathName == page.split('/')[1]) ? ("nav-link") : ("nav-link collapsed")}>
                                    <i className={`bi ${paths[page.split('/')[1]].icon}`}></i>
                                    <span>{paths[page.split('/')[1]].value}</span>
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </aside>
        </>
    )
}

export default Sidebar;