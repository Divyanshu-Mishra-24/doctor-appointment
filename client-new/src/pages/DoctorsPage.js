// DoctorsPage.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import MyLayout from "../components/layout";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Slider, Select, Radio, Button, Spin } from "antd";
import "../styles/DoctorsPage.css";

const { Option } = Select;
const { Search } = Input;

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
        // Map the API data to match our frontend structure
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

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, doctors]);

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
  onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
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
    </MyLayout>
  );
};

export default DoctorsPage;