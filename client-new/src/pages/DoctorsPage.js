import React, { useEffect, useState } from "react";
import axios from 'axios';
import MyLayout from "../components/layout";
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Slider, 
  Select, 
  Button, 
  Spin, 
  Modal, 
  DatePicker, 
  TimePicker, 
  message,
  Typography 
} from "antd";
import moment from 'moment';
import { useSelector } from "react-redux";
import "../styles/DoctorsPage.css";

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    gender: '',
    experience: [0, 30],
    fees: [0, 2000],
    searchQuery: ''
  });
  
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector(state => state.user);

  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Psychiatrist',
    'Neurologist',
    'General Physician'
  ];

  const getDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.data.success) {
        const doctorsWithDefaults = res.data.data.map(doctor => ({
          _id: doctor._id || '',
          userId: doctor.userId || '',
          name: `${doctor.f_name || ''} ${doctor.l_name || ''}`.trim() || 'Unknown Doctor',
          specialization: doctor.specialization || 'General Physician',
          experience: parseInt(doctor.experience) || 0,
          fees: doctor.feePerConsulatation || 0,
          timings: Array.isArray(doctor.timings) ? 
                   doctor.timings.join(' - ') : 
                   '9:00 AM - 5:00 PM',
          phone: doctor.phone_no || '',
          email: doctor.email || '',
          website: doctor.website || '',
          address: doctor.address || '',
          status: doctor.status || 'pending'
        }));
        setDoctors(doctorsWithDefaults);
        setFilteredDoctors(doctorsWithDefaults);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...doctors];
    
    if (filters.specialization) {
      result = result.filter(doctor => 
        doctor.specialization === filters.specialization
      );
    }
    
    if (filters.searchQuery) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    
    result = result.filter(doctor => 
      doctor.experience >= filters.experience[0] && 
      doctor.experience <= filters.experience[1]
    );
    
    result = result.filter(doctor => 
      doctor.fees >= filters.fees[0] && 
      doctor.fees <= filters.fees[1]
    );
    
    setFilteredDoctors(result);
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      specialization: '',
      gender: '',
      experience: [0, 30],
      fees: [0, 2000],
      searchQuery: ''
    });
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
          doctorId: selectedDoctor._id,
          userId: user._id,
          doctorInfo: selectedDoctor,
          userInfo: user,
          date: moment(date).format('DD-MM-YYYY'),
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

  const isTimeInSchedule = (selectedTime, doctorTimings) => {
    if (!doctorTimings || !selectedTime) return false;
    
    const [start, end] = doctorTimings.split(' - ');
    const startTime = moment(start, 'HH:mm A');
    const endTime = moment(end, 'HH:mm A');
    const timeToCheck = moment(selectedTime.format('HH:mm A'), 'HH:mm A');
    
    return timeToCheck.isBetween(startTime, endTime, null, '[]');
  };

  const getDisabledHours = (doctorTimings) => {
    if (!doctorTimings) return [];
    
    const [start, end] = doctorTimings.split(' - ');
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

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingModalVisible(true);
  };

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, doctors]);

  if (loading) {
    return (
      <MyLayout>
        <div className="text-center" style={{ padding: '100px' }}>
          <Spin size="large" />
        </div>
      </MyLayout>
    );
  }

  return (
    <MyLayout>
      <h1 className="text-center">Doctors</h1>
      <div className="doctors-page-container">
        <Col span={6} className="filter-sidebar">
          <Card title="Filter Doctors" className="filter-card">
            <div className="filter-section">
              <Search
                placeholder="Doctor name..."
                allowClear
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-section">
              <h4>Specialization</h4>
              <Select
                placeholder="Select specialization"
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('specialization', value)}
                value={filters.specialization || undefined}
                allowClear
              >
                {specializations.map(spec => (
                  <Option key={spec} value={spec}>{spec}</Option>
                ))}
              </Select>
            </div>
            
            <div className="filter-section">
              <h4>Experience (Years)</h4>
              <Slider
                range
                min={0}
                max={30}
                value={filters.experience}
                onChange={(value) => handleFilterChange('experience', value)}
              />
              <div className="slider-values">
                {filters.experience[0]} - {filters.experience[1]} years
              </div>
            </div>
            
            <div className="filter-section">
              <h4>Fees Range</h4>
              <Slider
                range
                min={0}
                max={2000}
                step={100}
                value={filters.fees}
                onChange={(value) => handleFilterChange('fees', value)}
              />
              <div className="slider-values">
                ₹{filters.fees[0]} - ₹{filters.fees[1]}
              </div>
            </div>
            
            <Button 
              type="primary" 
              onClick={applyFilters}
              className="apply-filters-btn"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={resetFilters}
              className="reset-filters-btn"
            >
              Reset
            </Button>
          </Card>
        </Col>
        
        <Col span={18} className="doctors-list">
          <Row gutter={[16, 16]}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Col span={12} key={doctor._id}>
                  <Card className="doctor-card">
                    <div className="doctor-card-content">
                      <div className="doctor-image">
                        <div className="default-avatar">
                          {doctor.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="doctor-info">
                        <h3>Dr. {doctor.name}</h3>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Experience:</strong> {doctor.experience} Years</p>
                        <p><strong>Fees:</strong> ₹{doctor.fees} per consultation</p>
                        <p><strong>Timings:</strong> {doctor.timings}</p>
                        <p><strong>Status:</strong> {doctor.status}</p>
                        <div className="doctor-actions">
                          <Button 
                            type="primary"
                            onClick={() => navigate(`/doctorProfile/${doctor._id}`)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            type="primary" 
                            onClick={() => handleBookClick(doctor)}
                          >
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} className="text-center">
                <Card>No doctors found matching your criteria</Card>
              </Col>
            )}
          </Row>
        </Col>
      </div>

      <Modal
        title={`Book Appointment with Dr. ${selectedDoctor?.name}`}
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
        {selectedDoctor && (
          <div className="booking-modal-content">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="booking-summary">
                  <Text strong>Consultation Fee:</Text> ₹{selectedDoctor.fees || 0}<br />
                  <Text strong>Available Timings:</Text> {selectedDoctor.timings || 'Not specified'}
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div className="form-item">
                  <Text strong>Select Date</Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    value={date}
                    onChange={(value) => {
                      setDate(value);
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
                      if (value && isTimeInSchedule(value, selectedDoctor.timings)) {
                        setTime(value);
                      } else {
                        message.warning(`Please select time between ${selectedDoctor.timings}`);
                        setTime(null);
                      }
                    }}
                    placeholder="Select Time (AM/PM)"
                    size="large"
                    showNow={false}
                    minuteStep={15}
                    disabledHours={() => getDisabledHours(selectedDoctor.timings)}
                    hideDisabledOptions={true}
                  />
                </div>
              </Col>
              
              {date && time && (
                <Col span={24}>
                  <div className="selected-slot">
                    <Text strong>Selected Appointment Slot:</Text><br />
                    <Text>📅 {moment(date).format('dddd, MMMM Do YYYY')}</Text><br />
                    <Text>🕐 {time.format('hh:mm A')}</Text>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </MyLayout>
  );
};

export default DoctorsPage;