import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Badge, message } from 'antd';
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';
import AnimatedBackground from './AnimatedBackground';

import DoctorLogo from "./DoctorLogo";

const MyLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(ThemeContext);

    //logout function
    const handleLogout = () => {
        localStorage.clear()
        message.success('Logout Successfully')
        navigate('/login')
    }

    //Doctor Menu
    const doctorMenu =[
    {
        name:'Home',
        path:'/',
        icon:'fa-solid fa-house',
    },
    {
        name:'Appointments',
        path:'/doctor-appointments',
        icon:'fa-solid fa-list',
    },
    
    {
        name:'Profile',
        path:`/doctor/profile/${user?._id}`,
        icon:'fa-solid fa-user',
    },
    {
        name:'Information',
        path:`/doctor/info/${user?._id}`,
        icon:'fa-solid fa-info-circle' 
    }
    
];

    //rendering menu list
    const SidebarMenu = user?.isAdmin 
    ? adminMenu 
    : user?.isDoctor 
    ?doctorMenu
    :userMenu;

    return (
        <div className="main">
            <div className="layout">
                {/* Top Navigation Bar */}
                <div className="navbar">
                    <div className="navbar-left">
                        <Link to="/" className="logo">
                            <DoctorLogo size={42} />
                        </Link>
                        <div className="nav-menu">
                            {SidebarMenu.map((menu, index) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <div
                                        key={index}
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="navbar-right">
                        <div className="header-content">
                            <div className="theme-toggle" onClick={toggleTheme}>
                                {theme === 'light' ? (
                                    <i className="fa-solid fa-moon"></i>
                                ) : (
                                    <i className="fa-solid fa-sun"></i>
                                )}
                            </div>
                            <Badge count={user && user.notification.length} onClick={()=>{navigate('/notification')}}>
                                 <i className="fa-solid fa-bell"></i>
                            </Badge>
                            <Link to='/profile' className="user-profile-link">
                                {user?.profilePicture ? (
                                    <img 
                                        src={user.profilePicture} 
                                        alt="profile" 
                                        className="nav-profile-pic" 
                                    />
                                ) : (
                                    <div className="nav-profile-initial">
                                        {user?.f_name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                            <div
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="content">
                    {location.pathname !== '/' && <AnimatedBackground />}
                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLayout;