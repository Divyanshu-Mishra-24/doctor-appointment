import React, { useState } from "react";
import '../styles/loginStyle.css'
import { Form, Input, message as antdMessage } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/features/alertSlice'

const Login = () => {
    const [formMessage, setFormMessage] = useState(null);
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/login', values);
            dispatch(hideLoading())
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                setMessageType('success');
                setFormMessage('Login successful');
                antdMessage.success('Login successful');
                navigate('/');
            } else {
                setMessageType('error');
                setFormMessage(res.data.message);
                antdMessage.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            setMessageType('error');
            setFormMessage('Something went wrong');
            antdMessage.error('Something went wrong');
        }
    };

    return (
        <>
            <div className="auth-page">
                <div className="bg-blob blob1"></div>
                <div className="bg-blob blob2"></div>
                <div className="auth-card">

                    {/* LEFT ILLUSTRATION */}
                    <div className="auth-left">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                            alt="login illustration"
                        />
                    </div>

                    {/* RIGHT FORM */}
                    <div className="auth-right">
                        {formMessage && (
                            <div className={`inline-message ${messageType}`}>
                                {formMessage}
                            </div>
                        )}

                        <Form layout="vertical" onFinish={onFinishHandler}>
                            <h2>Welcome Back</h2>
                            <p className="subtitle">Login to your account</p>

                            <Form.Item name="email">
                                <Input placeholder="Email address" />
                            </Form.Item>

                            <Form.Item name="passwd">
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <button className="auth-btn" type="submit">
                                Sign In
                            </button>

                            <p className="switch-text">
                                Don’t have an account? <Link to="/register">Create one</Link>
                            </p>
                        </Form>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Login;
