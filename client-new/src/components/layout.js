import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Badge, message } from 'antd'

const MyLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

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
                        <div className="logo">
                            <h4>Doctor's App</h4>
                        </div>
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
                            <Badge count={user && user.notification.length} onClick={()=>{navigate('/notification')}}>
                                 <i className="fa-solid fa-bell"></i>
                            </Badge>
                            <Link to='/profile' className="user-name">{user?.f_name}</Link>
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
                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLayout;