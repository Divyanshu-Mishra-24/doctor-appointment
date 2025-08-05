import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';
import MyLayout from "../components/layout";
import { Row, Col, Card, Typography, Divider, Carousel, Button } from "antd";
import DoctorList from "../components/DoctorList";
import '../styles/HomePage.css'; // You'll need to create this CSS file

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors data
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      setLoading(true);
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log("Auth failed or server error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Carousel content
  const carouselContent = [
    {
      title: "Quality Healthcare",
      description: "Access to top medical professionals in various specialties",
      image: "https://via.placeholder.com/800x400?text=Quality+Healthcare"
    },
    {
      title: "24/7 Availability",
      description: "Book appointments anytime, anywhere",
      image: "https://via.placeholder.com/800x400?text=24/7+Availability"
    },
    {
      title: "Patient-Centered Care",
      description: "Personalized treatment plans for your needs",
      image: "https://via.placeholder.com/800x400?text=Patient+Centered+Care"
    }
  ];

  const features = [
    {
      title: "Easy Booking",
      description: "Simple and quick appointment scheduling",
      icon: "📅"
    },
    {
      title: "Expert Doctors",
      description: "Verified and experienced medical professionals",
      icon: "👨‍⚕️"
    },
    {
      title: "Secure Platform",
      description: "Your data privacy is our priority",
      icon: "🔒"
    },
    {
      title: "Health Records",
      description: "Access your medical history anytime",
      icon: "📋"
    }
  ];

  return (
    <MyLayout>
      {/* Hero Carousel */}
      <Carousel autoplay className="home-carousel">
        {carouselContent.map((item, index) => (
          <div key={index} className="carousel-item">
            <img src={item.image} alt={item.title} className="carousel-image" />
            <div className="carousel-caption">
              <Title level={2} className="carousel-title">{item.title}</Title>
              <Text className="carousel-text">{item.description}</Text>
              <Button type="primary" size="large" className="carousel-button">
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Features Section */}
      <div className="features-section">
        <Title level={2} className="section-title">Why Choose Us</Title>
        <Row gutter={[16, 16]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="feature-card">
                <Text className="feature-icon">{feature.icon}</Text>
                <Title level={4}>{feature.title}</Title>
                <Text>{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Doctors Section */}
      <div className="doctors-section">
        <Title level={2} className="section-title">Our Doctors</Title>
        <Paragraph className="section-subtitle">
          Meet our team of experienced healthcare professionals
        </Paragraph>
        
        {loading ? (
          <div className="loading-spinner">Loading doctors...</div>
        ) : (
          <Row gutter={[16, 16]} justify="center">
            {doctors.map((doctor) => (
              <Col xs={24} sm={12} md={8} lg={6} key={doctor._id}>
                <DoctorList doctor={doctor} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <Card className="cta-card">
          <Title level={3}>Ready to take control of your health?</Title>
          <Paragraph>
            Book an appointment with one of our specialists today and start your journey to better health.
          </Paragraph>
          <Button type="primary" size="large">Find a Doctor</Button>
        </Card>
      </div>
    </MyLayout>
  );
};

export default HomePage;