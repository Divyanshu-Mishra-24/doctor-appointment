import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Card, Row, Col, Button, Divider, Tag, Spin, Alert, 
  Descriptions, Typography, Space, Image, Modal, DatePicker, TimePicker, message 
} from "antd";
import { 
  UserOutlined, CalendarOutlined, PhoneOutlined, 
  EnvironmentOutlined, BookOutlined, TrophyOutlined,
  ClockCircleOutlined, DollarOutlined, StarOutlined 
} from "@ant-design/icons";
import MyLayout from "../components/layout";
import moment from "moment";
import { useSelector } from "react-redux";
import "../styles/DoctorProfile.css";

const { Title, Text, Paragraph } = Typography;

const DoctorProfile = () => {
  // 🔥 FIXED: Changed from 'id' to 'doctorId' to match the route parameter
  const { doctorId } = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector(state => state.user);

 const fetchDoctorProfile = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    console.log("🔍 Fetching doctor with ID:", doctorId);

    const res = await axios.post(
      "/api/v1/doctor/getDoctorById",
      { doctorId }, // Using the doctorId from URL params
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Doctor not found");
    }

    setDoctor(res.data.data);

  } catch (err) {
    console.error("❌ Fetch error:", err);
    setError(err.response?.data?.message || "Error fetching doctor");
  } finally {
    setLoading(false);
  }
};
  const handleBooking = async () => {
    if (!date || !time) {
      message.warning("Please select both date and time");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        '/api/v1/user/book-appointment',
        {
          doctorId: doctorId, // 🔥 FIXED: Using consistent doctorId
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date,
          time: time.format("HH:mm")
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setBookingModalVisible(false);
        setDate(null);
        setTime(null);
      } else {
        message.error(res.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      message.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  const isTimeInSchedule = (selectedTime) => {
    if (!doctor || !doctor.timings || !selectedTime) return false;
    
    const [start, end] = doctor.timings;
    const startTime = moment(start, 'HH:mm A');
    const endTime = moment(end, 'HH:mm A');
    const timeToCheck = moment(selectedTime.format('HH:mm A'), 'HH:mm A');
    
    return timeToCheck.isBetween(startTime, endTime, null, '[]');
  };

  const getDisabledHours = () => {
    if (!doctor || !doctor.timings) return [];
    
    const [start, end] = doctor.timings;
    const startHour = parseInt(moment(start, 'HH:mm A').format('H'));
    const endHour = parseInt(moment(end, 'HH:mm A').format('H'));
    
    const disabledHours = [];
    for (let i = 0; i < 24; i++) {
      if (i < startHour || i >= endHour) {
        disabledHours.push(i);
      }
    }
    return disabledHours;
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [doctorId]); // 🔥 FIXED: Dependency array now uses doctorId

  if (loading) {
    return (
      <MyLayout>
        <div className="doctor-profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" tip="Loading doctor profile..." />
          </div>
        </div>
      </MyLayout>
    );
  }

  if (error) {
    return (
      <MyLayout>
        <div className="doctor-profile-container">
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ margin: '20px 0' }}
          />
          <Button type="primary" onClick={fetchDoctorProfile}>
            Try Again
          </Button>
        </div>
      </MyLayout>
    );
  }

  if (!doctor) {
    return (
      <MyLayout>
        <div className="doctor-profile-container">
          <Alert
            message="Not Found"
            description="Doctor profile not found"
            type="warning"
            showIcon
            style={{ margin: '20px 0' }}
          />
        </div>
      </MyLayout>
    );
  }

  return (
    <MyLayout>
      <div className="doctor-profile-container">
        <Card className="doctor-profile-card">
          <Row gutter={[24, 24]}>
            {/* Doctor Image and Basic Info */}
            <Col xs={24} md={8}>
              <div className="doctor-avatar-container">
                {doctor.profilePicture ? (
                  <Image
                    src={doctor.profilePicture}
                    alt={`Dr. ${doctor.f_name} ${doctor.l_name}`}
                    className="doctor-avatar"
                  />
                ) : (
                  <div className="default-avatar">
                    {doctor.f_name?.charAt(0)?.toUpperCase()}
                    {doctor.l_name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              
              <Title level={2} className="doctor-name">
                Dr. {doctor.f_name} {doctor.l_name}
              </Title>
              
              <Tag color="blue" icon={<StarOutlined />} className="specialization-tag">
                {doctor.specialization}
              </Tag>
              
              <div className="doctor-stats">
                <div className="stat-item">
                  <TrophyOutlined />
                  <span>{doctor.experience || 0} Years Experience</span>
                </div>
                <div className="stat-item">
                  <DollarOutlined />
                  <span>₹{doctor.feePerConsulatation || 0} per consultation</span>
                </div>
              </div>
              
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={() => setBookingModalVisible(true)}
                className="book-appointment-btn"
              >
                Book Appointment
              </Button>
            </Col>
            
            {/* Doctor Details */}
            <Col xs={24} md={16}>
              <div className="doctor-details-section">
                <Title level={4} className="section-title">
  <UserOutlined /> About Doctor
</Title>
<Paragraph>
  {doctor.additionalInfo?.bio || doctor.bio || "No bio available"}
</Paragraph>
                <Divider />
                
                <Title level={4} className="section-title">
                  <CalendarOutlined /> Availability
                </Title>
                <Space direction="vertical">
                  <div className="availability-item">
                    <ClockCircleOutlined />
                    <Text strong>Timings:</Text>
                    <Text>
                      {doctor.timings?.[0] || 'Not specified'} - {doctor.timings?.[1] || 'Not specified'}
                    </Text>
                  </div>
                  <div className="availability-item">
                    <PhoneOutlined />
                    <Text strong>Phone:</Text>
                    <Text>{doctor.phone_no || doctor.additionalInfo?.phone || 'Not specified'}</Text>
                  </div>
                  <div className="availability-item">
                    <EnvironmentOutlined />
                    <Text strong>Address:</Text>
                    <Text>{doctor.address || doctor.additionalInfo?.address || 'Not specified'}</Text>
                  </div>
                </Space>
                
                {doctor.additionalInfo?.education && (
                  <>
                    <Divider />
                    <Title level={4} className="section-title">
                      <BookOutlined /> Education & Qualifications
                    </Title>
                    <Descriptions column={1} bordered size="small">
                      {doctor.additionalInfo.education.tenth && (
                        <Descriptions.Item label="10th">
                          {doctor.additionalInfo.education.tenth.institution} ({doctor.additionalInfo.education.tenth.year})
                        </Descriptions.Item>
                      )}
                      {doctor.additionalInfo.education.twelfth && (
                        <Descriptions.Item label="12th">
                          {doctor.additionalInfo.education.twelfth.institution} ({doctor.additionalInfo.education.twelfth.year})
                        </Descriptions.Item>
                      )}
                      {doctor.additionalInfo.education.bachelors && (
                        <Descriptions.Item label="Bachelors">
                          {doctor.additionalInfo.education.bachelors.degree} at {doctor.additionalInfo.education.bachelors.institution} ({doctor.additionalInfo.education.bachelors.year})
                        </Descriptions.Item>
                      )}
                      {doctor.additionalInfo.education.masters && (
                        <Descriptions.Item label="Masters">
                          {doctor.additionalInfo.education.masters.degree} at {doctor.additionalInfo.education.masters.institution} ({doctor.additionalInfo.education.masters.year})
                        </Descriptions.Item>
                      )}
                      {doctor.additionalInfo.education.additional?.map((edu, index) => (
                        <Descriptions.Item key={index} label={edu.degree}>
                          {edu.institution} ({edu.year})
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* Booking Modal */}
        <Modal
          title={`Book Appointment with Dr. ${doctor.f_name} ${doctor.l_name}`}
          visible={bookingModalVisible}
          onCancel={() => setBookingModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setBookingModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleBooking}
              disabled={!date || !time}
            >
              Confirm Booking
            </Button>,
          ]}
          width={700}
        >
          <div className="booking-modal-content">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="booking-summary">
                  <Text strong>Consultation Fee:</Text> ₹{doctor.feePerConsulatation || 0}<br />
                  <Text strong>Available Timings:</Text> {doctor.timings?.[0] || 'Not specified'} - {doctor.timings?.[1] || 'Not specified'}
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div className="form-item">
                  <Text strong>Select Date</Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    value={date ? moment(date, 'DD-MM-YYYY') : null}
                    onChange={(value) => {
                      setDate(value || null);
                    }}
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    placeholder="Select Date"
                    size="large"
                  />
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div className="form-item">
                  <Text strong>Select Time</Text>
                  <TimePicker
                    style={{ width: '100%' }}
                    format="hh:mm A"
                    use12Hours
                    value={time}
                    onChange={(value) => {
                      if (value && isTimeInSchedule(value)) {
                        setTime(value);
                      } else {
                        message.warning(`Please select time between ${doctor.timings[0]} - ${doctor.timings[1]}`);
                        setTime(null);
                      }
                    }}
                    placeholder="Select Time (AM/PM)"
                    size="large"
                    showNow={false}
                    minuteStep={15}
                    disabledHours={getDisabledHours}
                    hideDisabledOptions={true}
                  />
                </div>
              </Col>
              
              {date && time && (
                <Col span={24}>
                  <div className="selected-slot">
                    <Text strong>Selected Appointment Slot:</Text><br />
                    <Text>📅 {moment(date, 'DD-MM-YYYY').format('dddd, MMMM Do YYYY')}</Text><br />
                    <Text>🕐 {time.format('hh:mm A')}</Text>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Modal>
      </div>
    </MyLayout>
  );
};

export default DoctorProfile;