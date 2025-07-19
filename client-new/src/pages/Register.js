import React, { useState } from "react";
import '../styles/registerStyle.css';
import { Form, Input, Radio, message as antdMessage } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const Register = () => {
    const [formMessage, setFormMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        <>
            <div className="form-container">
                {formMessage && (
                    <div className={`inline-message ${messageType}`}>
                        {formMessage}
                    </div>
                )}
                <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
                    <h3 className="text-center">Register Form</h3>
                    <Form.Item label="First Name" name="f_name">
                        <Input type="text" required autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Last Name" name="l_name">
                        <Input type="text" required autoComplete="family-name"/>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input type="email" required autoComplete="new-email"/>
                    </Form.Item>
                    <Form.Item label="Password" name="passwd">
                        <Input type="password" required autoComplete="new-password"/>
                    </Form.Item>
                    {/* <Form.Item label="Registering as:" name="isDoctor">
                        <Radio.Group onChange={(e) => setIsDoctor(e.target.value)} value={isDoctor}>
                            <Radio value={false}>Patient</Radio>
                            <Radio value={true}>Doctor</Radio>
                        </Radio.Group>
                    </Form.Item> */}
                    <Link to='/login' className="m-2">Already a user?</Link>
                    <button
                        className="btn"
                        type="submit"
                        style={{ backgroundColor: '#0000FF', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
                    >
                        Register
                    </button>
                </Form>
            </div>
        </>
    );
};

export default Register;