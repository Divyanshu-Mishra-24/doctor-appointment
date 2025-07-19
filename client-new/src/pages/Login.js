import React,{useState} from "react";
import '../styles/loginStyle.css'
import { Form, Input, message as antdMessage } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../redux/features/alertSlice'

const Login = () => {
    const [formMessage, setFormMessage] = useState(null);
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinishHandler = async(values) => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/login', values);
            dispatch(hideLoading())
            if(res.data.success){
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
            <div className="form-container">
                {formMessage && (
                    <div className={`inline-message ${messageType}`}>
                        {formMessage}
                    </div>
                )}
                <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
                    <h3 className="text-center">Login Form</h3>
                    <Form.Item label="Email" name="email">
                        <Input type="email" required />
                    </Form.Item>
                    <Form.Item label="Password" name="passwd">
                        <Input type="password" required />
                    </Form.Item>
                    <Link to='/register' className="m-2">Not a user ?</Link>
                    <button
                        className="btn"
                        type="submit"
                        style={{ backgroundColor: '#0000FF', color: 'black', padding: '10px 60px', border: 'none', borderRadius: '5px' }}
                    >
                        Login
                    </button>
                </Form>
            </div>
        </>
    );
};

export default Login;
