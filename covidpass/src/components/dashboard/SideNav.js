import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = () => {
    return(
        <div className="sidenav">
            <div className="header">
                <h3>CovidPass</h3>
            </div>
            <div className="content-sidenav">
                <Link to={'/dashboard'}>Dashboard</Link>
                <Link to={'/dashboard/employees'}>Employees</Link>
                <Link to={'/dashboard/groups'}>Groups</Link>
                <Link to={'/dashboard/employees'}>Employees</Link>
            </div>
        </div>
    )
};

export default SideNav;