import React, { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Row, Col, Form, Input, Select, DatePicker, Button,
  message, Divider, Spin, Alert, Tag, Space, Modal
} from "antd";
import {
  InfoCircleOutlined, UserOutlined, EditOutlined,
  CheckOutlined, CloseOutlined, TrophyOutlined,
  BookOutlined, PlusOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import MyLayout from "../../components/layout";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import "../../styles/Information.css";

const { Option } = Select;
const { TextArea } = Input;

const Information = () => {
    const { id } = useParams();
    const { user } = useSelector(state => state.user);
    const [form] = useForm();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState(null);
    const [error, setError] = useState(null);
    const [additionalEducationFields, setAdditionalEducationFields] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

   const fetchAdditionalInfo = async () => {
    try {
        setLoading(true);
        setError(null);
        
        // 1. First get the doctor's basic info using user._id
        const doctorRes = await axios.post(
            "/api/v1/doctor/getDoctorInfo",
            { userId: user._id },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (!doctorRes.data.success || !doctorRes.data.data) {
            throw new Error(doctorRes.data.message || 'Failed to fetch doctor information');
        }

        const doctorData = doctorRes.data.data;
        const doctorId = doctorData._id; // Get the actual doctor ID
        
        // 2. Now fetch the additional info using the doctorId (not user._id)
        const infoRes = await axios.get(
            `/api/v1/doctor/info/${doctorId}`,  // Use doctorId instead of user._id
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (!infoRes.data.success) {
            // Additional info not found is not an error - just means doctor hasn't filled it yet
            if (infoRes.status === 404) {
                setAdditionalInfo(null);
                form.resetFields(); // Clear the form
                return;
            }
            throw new Error(infoRes.data.message || 'Failed to fetch additional information');
        }

        const additionalInfo = infoRes.data.data;
        setAdditionalInfo(additionalInfo);

        // Prepare form data with proper formatting
        const formData = {
            ...additionalInfo,
            dateOfBirth: additionalInfo.dateOfBirth 
                ? moment(additionalInfo.dateOfBirth) 
                : null,
            // Ensure education structure exists
            education: additionalInfo.education || {
                tenth: {},
                twelfth: {},
                bachelors: {},
                masters: {},
                additional: []
            }
        };

        // Set form values
        form.setFieldsValue(formData);

        // Set additional education fields count if they exist
        if (additionalInfo.education?.additional?.length) {
            setAdditionalEducationFields(additionalInfo.education.additional.length);
        } else {
            setAdditionalEducationFields(0);
        }

    } catch (err) {
        console.error('Fetch error:', err);
        
        // Handle specific error cases
        if (err.response?.status === 404) {
            // Additional info not found is not an error state
            setAdditionalInfo(null);
            form.resetFields();
            setError(null);
        } else if (err.message.includes('doctor information')) {
            // Failed to get basic doctor info
            setError(err.message || 'Failed to fetch doctor information');
        } else {
            // Other errors
            setError(err.response?.data?.message || err.message || 'Failed to fetch information');
        }
    } finally {
        setLoading(false);
    }
};

    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());
            const doctorRes = await axios.post(
                "/api/v1/doctor/getDoctorInfo",
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const doctorId = doctorRes.data.data._id;
            const payload = {
                ...values,
                dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
                userId: user._id
            };

            const endpoint = `/api/v1/doctor/info/${doctorId}`;
            const method = additionalInfo ? 'put' : 'post';

            const res = await axios[method](endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                message.success(res.data.message);
                setEditing(false);
                fetchAdditionalInfo();
                localStorage.setItem("infoComplete", "true");
                
                Modal.success({
                    title: 'Profile Complete!',
                    content: 'Your doctor profile is now fully set up.',
                    okText: 'Go to Homepage',
                    cancelText: 'Stay Here',
                    onOk: () => navigate('/'),
                    onCancel: () => {}
                });
            } else {
                message.error(res.data.message || 'Failed to save information');
            }
        } catch (err) {
            console.error('Submit error:', err);
            message.error(err.response?.data?.message || 'Failed to save information');
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        fetchAdditionalInfo();
    }, []);

    const calculateProfileCompletion = () => {
        if (!additionalInfo) return 0;
        const requiredFields = ['phone', 'gender', 'dateOfBirth', 'address', 'bio'];
        const completedFields = requiredFields.filter(field =>
            additionalInfo[field] && additionalInfo[field].toString().trim() !== ''
        ).length;
        return Math.round((completedFields / requiredFields.length) * 100);
    };

    const addEducationField = () => {
        setAdditionalEducationFields(prev => prev + 1);
    };

    const removeEducationField = (index) => {
        setAdditionalEducationFields(prev => prev - 1);
        form.setFieldsValue({
            education: {
                ...form.getFieldValue('education'),
                additional: form.getFieldValue('education')?.additional?.filter((_, i) => i !== index)
            }
        });
    };

    const completionPercentage = calculateProfileCompletion();

    if (loading) {
        return (
            <MyLayout>
                <div className="information-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" tip="Loading information..." />
                    </div>
                </div>
            </MyLayout>
        );
    }

    if (error) {
        return (
            <MyLayout>
                <div className="information-container">
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Button
                        type="primary"
                        onClick={fetchAdditionalInfo}
                    >
                        Retry
                    </Button>
                </div>
            </MyLayout>
        );
    }

    return (
        <MyLayout>
            <div className="information-container">
                <h1 className="page-title">Doctor Information</h1>

                <div className="completion-status">
                    <div className="completion-bar">
                        <div
                            className="completion-fill"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <span className="completion-text">
                        Profile {completionPercentage}% Complete
                    </span>
                    {completionPercentage === 100 ? (
                        <Tag icon={<CheckOutlined />} color="success">
                            Complete
                        </Tag>
                    ) : (
                        <Tag icon={<CloseOutlined />} color="warning">
                            Incomplete
                        </Tag>
                    )}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    scrollToFirstError
                >
                    {/* Personal Information Card */}
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                <span>Personal Information</span>
                            </Space>
                        }
                        className="info-card"
                        extra={
                            <Button
                                type={editing ? 'default' : 'primary'}
                                icon={editing ? <CloseOutlined /> : <EditOutlined />}
                                onClick={() => setEditing(!editing)}
                            >
                                {editing ? 'Cancel' : 'Edit'}
                            </Button>
                        }
                    >
                        {editing ? (
                            <>
                                <Row gutter={24}>
                                    <Col xs={24} md={12} lg={8}>
                                        <Form.Item
                                            name="phone"
                                            label="Phone Number"
                                            rules={[
                                                { required: true, message: 'Please input your phone number!' },
                                                { pattern: /^[0-9]{10,15}$/, message: 'Please enter a valid phone number!' }
                                            ]}
                                        >
                                            <Input placeholder="+1 234 567 890" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8}>
                                        <Form.Item
                                            name="gender"
                                            label="Gender"
                                            rules={[{ required: true, message: 'Please select your gender!' }]}
                                        >
                                            <Select placeholder="Select gender">
                                                <Option value="male">Male</Option>
                                                <Option value="female">Female</Option>
                                                <Option value="other">Other</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12} lg={8}>
                                        <Form.Item
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            rules={[{ required: true, message: 'Please select your date of birth!' }]}
                                        >
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                disabledDate={current => current && current > moment().endOf('day')}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24}>
                                        <Form.Item
                                            name="address"
                                            label="Address"
                                            rules={[{ required: true, message: 'Please input your address!' }]}
                                        >
                                            <Input.TextArea rows={2} placeholder="123 Main St, City, Country" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24}>
                                        <Form.Item
                                            name="bio"
                                            label="Professional Bio"
                                            rules={[
                                                { required: true, message: 'Please write a short bio!' },
                                                { min: 50, message: 'Bio must be at least 50 characters!' },
                                                { max: 500, message: 'Bio cannot exceed 500 characters!' }
                                            ]}
                                        >
                                            <TextArea
                                                rows={4}
                                                showCount
                                                maxLength={500}
                                                placeholder="Tell us about your professional background, education, and specialties..."
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <div className="info-view">
                                {additionalInfo ? (
                                    <>
                                        <Row gutter={24}>
                                            <Col xs={24} md={12} lg={8}>
                                                <InfoField label="Phone" value={additionalInfo.phone} />
                                            </Col>
                                            <Col xs={24} md={12} lg={8}>
                                                <InfoField
                                                    label="Gender"
                                                    value={additionalInfo.gender ?
                                                        `${additionalInfo.gender.charAt(0).toUpperCase()}${additionalInfo.gender.slice(1)}` :
                                                        'Not specified'
                                                    }
                                                />
                                            </Col>
                                            <Col xs={24} md={12} lg={8}>
                                                <InfoField
                                                    label="Date of Birth"
                                                    value={additionalInfo.dateOfBirth ?
                                                        moment(additionalInfo.dateOfBirth).format('MMMM Do, YYYY') :
                                                        'Not specified'
                                                    }
                                                />
                                            </Col>
                                            <Col xs={24}>
                                                <InfoField label="Address" value={additionalInfo.address} />
                                            </Col>
                                            <Col xs={24}>
                                                <InfoField
                                                    label="Professional Bio"
                                                    value={additionalInfo.bio}
                                                    isParagraph
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <div className="empty-state">
                                        <InfoCircleOutlined className="empty-icon" />
                                        <p>No additional information available</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Education Card */}
                    <Card
                        title={
                            <Space>
                                <BookOutlined />
                                <span>Education & Certifications</span>
                            </Space>
                        }
                        className="info-card"
                    >
                        {editing ? (
                            <>
                                {/* 10th */}
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name={['education', 'tenth', 'institution']}
                                            label="10th Institution"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="High School Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name={['education', 'tenth', 'year']}
                                            label="10th Year"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., 2015" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* 12th */}
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name={['education', 'twelfth', 'institution']}
                                            label="12th Institution"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="Senior Secondary School" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name={['education', 'twelfth', 'year']}
                                            label="12th Year"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., 2017" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Bachelors */}
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'bachelors', 'degree']}
                                            label="Bachelors Degree"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., B.Sc Computer Science" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'bachelors', 'institution']}
                                            label="Bachelors Institution"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="University Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'bachelors', 'year']}
                                            label="Bachelors Year"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., 2021" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Masters */}
                                <Row gutter={16}>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'masters', 'degree']}
                                            label="Masters Degree"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., MDS" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'masters', 'institution']}
                                            label="Masters Institution"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="University Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            name={['education', 'masters', 'year']}
                                            label="Masters Year"
                                            rules={[{ required: true, message: 'Required' }]}
                                        >
                                            <Input placeholder="e.g., 2023" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Additional Education Fields */}
                                {Array.from({ length: additionalEducationFields }).map((_, index) => (
                                    <div key={index} style={{ marginBottom: 16, position: 'relative' }}>
                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name={['education', 'additional', index, 'degree']}
                                                    label={`Additional Degree #${index + 1}`}
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Input placeholder="e.g., PhD, Fellowship" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name={['education', 'additional', index, 'institution']}
                                                    label="Institution"
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Input placeholder="University/Hospital Name" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name={['education', 'additional', index, 'year']}
                                                    label="Year"
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Input placeholder="e.g., 2025" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Button
                                            type="link"
                                            danger
                                            onClick={() => removeEducationField(index)}
                                            style={{ position: 'absolute', right: 0, top: 0 }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="dashed"
                                    onClick={addEducationField}
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%', marginBottom: 24 }}
                                >
                                    Add More Education
                                </Button>
                            </>
                        ) : (
                            <>
                                {additionalInfo?.education ? (
                                    <div>
                                        <p><strong>10th:</strong> {additionalInfo.education.tenth?.institution} ({additionalInfo.education.tenth?.year})</p>
                                        <p><strong>12th:</strong> {additionalInfo.education.twelfth?.institution} ({additionalInfo.education.twelfth?.year})</p>
                                        <p><strong>Bachelors:</strong> {additionalInfo.education.bachelors?.degree} at {additionalInfo.education.bachelors?.institution} ({additionalInfo.education.bachelors?.year})</p>
                                        <p><strong>Masters:</strong> {additionalInfo.education.masters?.degree} at {additionalInfo.education.masters?.institution} ({additionalInfo.education.masters?.year})</p>
                                        
                                        {additionalInfo.education.additional?.map((edu, index) => (
                                            <p key={index}>
                                                <strong>{edu.degree}:</strong> {edu.institution} ({edu.year})
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No education information available</p>
                                )}
                            </>
                        )}
                    </Card>

                    <Divider />
                    {editing && (
                        <div className="form-actions">
                            <Button onClick={() => setEditing(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </div>
                    )}
                </Form>
            </div>
        </MyLayout>
    );
};

const InfoField = ({ label, value, isParagraph = false }) => (
    <div className="info-field">
        <label className="info-label">{label}</label>
        {isParagraph ? (
            <p className="info-value paragraph">{value || 'Not specified'}</p>
        ) : (
            <p className="info-value">{value || 'Not specified'}</p>
        )}
    </div>
);

export default Information;