import React, { useState } from "react";
import '../styles/registerStyle.css';
import { Form, Input, Radio, message as antdMessage } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { ThemeContext } from '../components/ThemeContext';
import { useContext } from 'react';

import DoctorLogo from "../components/DoctorLogo";

const Register = () => {
    const [formMessage, setFormMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/register', {
                ...values,
                isDoctor
            });
            dispatch(hideLoading());
            if (res.data.success) {
                setMessageType('success');
                setFormMessage('Registered Successfully');
                antdMessage.success('Registered Successfully');
                navigate('/login');
            } else {
                setMessageType('error');
                setFormMessage(res.data.message);
                antdMessage.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            setMessageType('error');
            setFormMessage('Something went wrong');
            antdMessage.error('Something went wrong');
        }
    };

    return (
  <div className="auth-page">
    <div className="theme-toggle-floating" onClick={toggleTheme}>
      {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
    </div>
    <div className="bg-blob blob1"></div>
  <div className="bg-blob blob2"></div>
    <div className="auth-card">

      {/* LEFT */}
      <div className="auth-left">
        <DoctorLogo size={180} />
      </div>

      {/* RIGHT */}
      <div className="auth-right">

        {formMessage && (
          <div className={`inline-message ${messageType}`}>
            {formMessage}
          </div>
        )}

        <Form layout="vertical" onFinish={onFinishHandler}>
          <h2>Create Account</h2>
          <p className="subtitle">Register to get started</p>

          <Form.Item name="f_name" rules={[{ required: true }]}>
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item name="l_name" rules={[{ required: true }]}>
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item name="passwd" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <button className="auth-btn" type="submit">
            Sign Up
          </button>
        </Form>

        {/* ⬇⬇⬇ MOVE LINK OUTSIDE FORM ⬇⬇⬇ */}
        <div className="switch-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  </div>
);

};

export default Register;