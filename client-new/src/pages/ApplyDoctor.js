import React from 'react';
import MyLayout from '../components/layout';
import { Col, Form, Row, Input, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';

const ApplyDoctor = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // ADD THIS LINE

    const handleFinish = async (values) => {
        try {
            console.log('Form Values:', values); // DEBUG: Check what values are being sent
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/apply-doctor', {
                ...values,
                userId: user._id,
                timings: [values.startTime.trim(), values.endTime.trim()]
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

    return (
        <MyLayout>
            <h1 className='text-center'>Apply Doctor</h1>
            <Form 
                form={form} 
                layout='vertical' 
                onFinish={handleFinish} 
                className='m-3'
                requiredMark={true}
            >
                <h4>Personal Details :</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='First Name' name='f_name' rules={[{ required: true }]}> 
                            <Input placeholder='Your name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Last Name' name='l_name' rules={[{ required: true }]}> 
                            <Input placeholder='Last name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Phone Number' name='phone_no' rules={[{ required: true }]}> 
                            <Input placeholder='Phone number' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Email' name='email' rules={[{ required: true }]}> 
                            <Input placeholder='Email address' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Website' name='website'> 
                            <Input placeholder='Website (optional)' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Address' name='address' rules={[{ required: true }]}> 
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>
                </Row>
                <h4>Professional Details :</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Specialization' name='specialization' rules={[{ required: true }]}> 
                            <Input placeholder='Specialization' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label='Experience' name='experience' rules={[{ required: true }]}> 
                            <Input placeholder='Experience in years' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        {/* FIXED: Corrected the field name from 'feePerConsulatation' to 'feePerConsultation' */}
                        <Form.Item label='Consultation Fee' name='feePerConsulatation' rules={[{ required: true }]}> 
                            <Input type='number' placeholder='Fee per consultation' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={4}>
                        <Form.Item label='Start Time (e.g. 09:00 AM)' name='startTime' rules={[{ required: true }]}> 
                            <Input placeholder='Start Time' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={4}>
                        <Form.Item label='End Time (e.g. 05:00 PM)' name='endTime' rules={[{ required: true }]}> 
                            <Input placeholder='End Time' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}></Col>
                    <Col xs={24} md={24} lg={8}>
                        <button className='btn btn-primary form-btn'>Submit</button>
                    </Col>
                </Row>
            </Form>
        </MyLayout>
    );
};

export default ApplyDoctor;