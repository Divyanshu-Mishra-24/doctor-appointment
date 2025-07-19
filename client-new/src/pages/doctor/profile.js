import React, { useEffect, useState } from "react";
import MyLayout from "../../components/layout";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Col,Row,Form,message,Input } from "antd";
import { showLoading,hideLoading } from "../../redux/features/alertSlice";
import '../../styles/Profile.css';
const Profile = () => {
    
    const params=useParams()
    const {user}=useSelector(state=>state.user)
    const [doctor,setDoctor]=useState(null)
    const dispatch=useDispatch()
    // const navigate=useNavigate()
    const [form] = Form.useForm();

    //Handle update form
    const handleFinish = async (values) => {
    try {
        console.log('Form Values:', values);
        dispatch(showLoading());
        
        // Prepare the data to send
        const updateData = {
            userId: user._id,
            ...values, // Spread all form values
            timings: [values.startTime?.trim(), values.endTime?.trim()].filter(time => time) // Handle timings properly
        };
        
        // Remove startTime and endTime from the main object since they're now in timings
        delete updateData.startTime;
        delete updateData.endTime;
        
        const res = await axios.post('/api/v1/doctor/updateProfile', updateData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        dispatch(hideLoading());
        if (res.data.success) {
            message.success(res.data.message);
            // Refresh the doctor info to show updated data
            getDoctorInfo();
        } else {
            message.error(res.data.message);
        }
    } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        message.error(error.response?.data?.message || 'Something went wrong');
    }
};

    //getDoctor Info
    const getDoctorInfo=async()=>{
        try {
            const res=await axios.post('/api/v1/doctor/getDoctorInfo',{
                userId:params.id
            },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success)
            {
                setDoctor(res.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getDoctorInfo()
    },[])

    return (
        <MyLayout>
            <div className="profile-wrapper">
    <div className="profile-left">
         <h1>My Profile</h1>
            {doctor && (
                <Form 
                form={form} 
                layout='vertical' 
                onFinish={handleFinish} 
                className='m-3'
                initialValues={doctor}
                // requiredMark={false}

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
                        <button className='btn btn-primary form-btn'>Update</button>
                    </Col>
                </Row>
            </Form>
            )}
      </div>

      
    <div className="profile-right">
      <div className="animated-bg">
        <div className="pulse-circle"></div>
        <div className="cross-box"></div>
        <div className="heart-line"></div>
      </div>
    </div>
  </div>
        </MyLayout>
    );
};

export default Profile;