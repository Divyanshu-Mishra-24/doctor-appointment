import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  message,
  Avatar,
  Divider,
  Typography,
  Space,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Spin
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PhoneOutlined,
  HomeOutlined,
  UploadOutlined,
  LoadingOutlined,
  CameraOutlined
} from '@ant-design/icons';
import axios from 'axios';
import MyLayout from '../components/layout';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // ✅ Get User Data
  const getUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found");
        return;
      }

      const res = await axios.post('/api/v1/user/getUserData', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUserInfo(res.data.data);
        form.setFieldsValue({
          f_name: res.data.data.f_name,
          l_name: res.data.data.l_name,
          email: res.data.data.email,
          age: res.data.data.age,
          phone: res.data.data.phone,
          address: res.data.data.address,
          gender: res.data.data.gender,
          dateOfBirth: res.data.data.dateOfBirth ? moment(res.data.data.dateOfBirth) : null,
          bio: res.data.data.bio,
        });
      } else {
        message.error(res.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // ✅ Update Profile Handler
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);

      const initialValues = {
        age: userInfo?.age,
        phone: userInfo?.phone,
        address: userInfo?.address,
        gender: userInfo?.gender,
        dateOfBirth: userInfo?.dateOfBirth ? moment(userInfo.dateOfBirth) : null,
        bio: userInfo?.bio,
      };

      const editableKeys = ['age', 'phone', 'address', 'gender', 'dateOfBirth', 'bio'];

      const hasChanges = editableKeys.some(
        key => JSON.stringify(values[key]) !== JSON.stringify(initialValues[key])
      );

      if (!hasChanges) {
        message.info("No changes detected");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
        userId: userInfo._id
      };

      const res = await axios.put('/api/v1/user/update-profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success("Profile updated successfully!");
        setUserInfo(res.data.data);
        setEditing(false);
      } else {
        message.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
      setEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      f_name: userInfo?.f_name,
      l_name: userInfo?.l_name,
      email: userInfo?.email,
      age: userInfo?.age,
      phone: userInfo?.phone,
      address: userInfo?.address,
      gender: userInfo?.gender,
      dateOfBirth: userInfo?.dateOfBirth ? moment(userInfo.dateOfBirth) : null,
      bio: userInfo?.bio,
    });
    setEditing(false);
  };

  const isProfileComplete = () => {
    return (
      userInfo?.phone &&
      userInfo?.address &&
      userInfo?.gender &&
      userInfo?.dateOfBirth
    );
  };

  // ✅ Fixed Profile Picture Upload Handler
  const handleImageChange = async (info) => {
    const file = info.file.originFileObj || info.file;
    
    if (!file) {
      message.error('No file selected');
      return;
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }

    // Validate file size (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', userInfo._id);

    const token = localStorage.getItem("token");

    try {
      setUploadLoading(true);
      
      const res = await axios.post('/api/v1/user/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success('Profile picture uploaded successfully!');
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: res.data.data.profilePicture,
        }));
      } else {
        message.error(res.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  // Upload props for Ant Design Upload component
  const uploadProps = {
    name: 'profilePicture',
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      return false; // Prevent automatic upload
    },
    onChange: handleImageChange,
  };

  if (loading && !userInfo) {
    return (
      <MyLayout>
        <div className="profile-loading" style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>Loading profile...</p>
        </div>
      </MyLayout>
    );
  }

  return (
    <MyLayout>
      <div className="profile-container">
        <Row gutter={16}>
          {/* LEFT: Profile Form */}
          <Col xs={24} md={17}>
            <Card className="profile-card">
              <div className="profile-header">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    size={100}
src={userInfo?.profilePicture ? `${process.env.REACT_APP_API || 'http://localhost:5000'}${userInfo.profilePicture}` : null}
                    icon={!userInfo?.profilePicture && <UserOutlined />}
                    className="profile-avatar"
                  />
                  {uploadLoading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />} />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '15px' }}>
                  <Upload {...uploadProps}>
                    <Button 
                      icon={<UploadOutlined />} 
                      loading={uploadLoading}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </Upload>
                </div>

                <Title level={2} style={{ margin: '15px 0 5px 0' }}>
                  {userInfo?.f_name} {userInfo?.l_name}
                </Title>
                <Text type="secondary">
                  {userInfo?.isAdmin ? 'Administrator' : userInfo?.isDoctor ? 'Doctor' : 'User'}
                </Text>
              </div>

              <Divider />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Title level={4}>Basic Information</Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="First Name" name="f_name">
                      <Input prefix={<UserOutlined />} disabled size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Last Name" name="l_name">
                      <Input prefix={<UserOutlined />} disabled size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email" name="email">
                      <Input prefix={<MailOutlined />} disabled size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Age" name="age">
                      <InputNumber
                        placeholder="Enter age"
                        disabled={!editing}
                        size="large"
                        style={{ width: '100%' }}
                        min={1}
                        max={120}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />
                <Title level={4}>Additional Information</Title>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Phone" name="phone">
                      <Input prefix={<PhoneOutlined />} disabled={!editing} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Gender" name="gender">
                      <Select placeholder="Select gender" disabled={!editing} size="large">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Date of Birth" name="dateOfBirth">
                      <DatePicker
                        placeholder="Select date of birth"
                        disabled={!editing}
                        size="large"
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Address" name="address">
                      <Input prefix={<HomeOutlined />} disabled={!editing} size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item label="Bio" name="bio">
                      <TextArea
                        placeholder="Tell us about yourself..."
                        disabled={!editing}
                        rows={4}
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                  <Space>
                    {!editing ? (
                      <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)} size="large">
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          loading={loading}
                          size="large"
                        >
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} icon={<CloseOutlined />} size="large">
                          Cancel
                        </Button>
                      </>
                    )}
                  </Space>
                </div>
              </Form>
            </Card>
          </Col>

          {/* RIGHT: Completed Profile Card */}
          {isProfileComplete() && (
            <Col xs={24} md={7}>
              <Card className="profile-complete-card">
                <div className="profile-complete-header">
                  <Avatar
                    size={64}
                    src={userInfo?.profilePicture ? `${process.env.REACT_APP_API || 'http://localhost:5000'}${userInfo.profilePicture}` : null}
                    icon={!userInfo?.profilePicture && <UserOutlined />}
                    className="profile-avatar-small"
                  />
                  <Title level={4}>🎉 Profile Completed!</Title>
                  <Text>Your profile is up-to-date and ready to go.</Text>
                </div>

                <Divider />

                <div className="profile-summary">
                  <p><strong>Name:</strong> {userInfo.f_name} {userInfo.l_name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Phone:</strong> {userInfo.phone}</p>
                  <p><strong>Gender:</strong> {userInfo.gender}</p>
                  <p><strong>DOB:</strong> {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Address:</strong> {userInfo.address}</p>
                  {userInfo.bio && <p><strong>Bio:</strong> {userInfo.bio}</p>}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => navigate('/')}
                  >
                    ✅ Go to Home
                  </Button>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </MyLayout>
  );
};

export default ProfilePage;