import React, { useState } from 'react';
import MyLayout from '../components/layout';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Input, message, Spin, Space, Divider } from 'antd';
import { 
  CreditCardOutlined, 
  PayCircleOutlined, 
  BankOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import '../styles/PaymentStyles.css'; // Let's make a quick css for this

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // We expect state to have { doctor, date, time, appointmentId }
  const { doctor, date, time, appointmentId } = location.state || {};

  if (!doctor) {
    return (
      <MyLayout>
        <div className="payment-container" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>No payment details found</h3>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </MyLayout>
    );
  }

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      const res = await axios.post('/api/v1/user/complete-payment', 
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setProcessing(false);
      
      if (res.data.success) {
        setSuccess(true);
        message.success('Payment completed successfully!');
        
        // Redirect to appointments after successful payment
        setTimeout(() => {
          navigate('/appointments');
        }, 2000);
      } else {
        message.error(res.data.message || 'Payment failed');
      }
    } catch (error) {
      setProcessing(false);
      console.error(error);
      message.error('Something went wrong during payment');
    }
  };

  if (success) {
    return (
      <MyLayout>
        <div className="payment-container success-state">
          <Card className="payment-card success-card">
            <CheckCircleOutlined style={{ fontSize: '64px', color: 'var(--accent-color)' }} />
            <h2>Payment Successful!</h2>
            <p>Your appointment with Dr. {doctor.f_name || doctor.firstName} {doctor.l_name || doctor.lastName} is confirmed.</p>
            <p>Redirecting to your appointments...</p>
          </Card>
        </div>
      </MyLayout>
    );
  }

  return (
    <MyLayout>
      <div className="payment-container">
        <h2 className="payment-title">Checkout</h2>
        
        <div className="payment-content">
          <Card className="payment-card summary-card">
            <h3>Appointment Summary</h3>
            <Divider className="neo-divider" />
            <div className="summary-row">
              <span>Doctor:</span>
              <strong>Dr. {doctor.f_name} {doctor.l_name}</strong>
            </div>
            <div className="summary-row">
              <span>Specialization:</span>
              <strong>{doctor.specialization}</strong>
            </div>
            <div className="summary-row">
              <span>Date:</span>
              <strong>{date}</strong>
            </div>
            <div className="summary-row">
              <span>Time:</span>
              <strong>{time}</strong>
            </div>
            <Divider className="neo-divider" />
            <div className="summary-row total">
              <span>Total Amount:</span>
              <strong className="amount">₹{doctor.feePerConsulatation}</strong>
            </div>
          </Card>

          <Card className="payment-card method-card">
            <h3>Select Payment Method</h3>
            <Divider className="neo-divider" />
            
            <Radio.Group 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              value={paymentMethod}
              className="payment-options"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="card" className="payment-radio">
                  <CreditCardOutlined className="pay-icon" /> Credit/Debit Card
                </Radio>
                {paymentMethod === 'card' && (
                  <div className="payment-form neo-form">
                    <Input placeholder="Card Number" maxLength={16} />
                    <Space style={{ marginTop: '10px', width: '100%' }}>
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" maxLength={3} type="password" />
                    </Space>
                  </div>
                )}
                
                <Radio value="upi" className="payment-radio">
                  <PayCircleOutlined className="pay-icon" /> UPI / QR
                </Radio>
                {paymentMethod === 'upi' && (
                  <div className="payment-form neo-form">
                    <Input placeholder="Enter UPI ID (e.g., username@bank)" />
                  </div>
                )}
                
                <Radio value="netbanking" className="payment-radio">
                  <BankOutlined className="pay-icon" /> Net Banking
                </Radio>
              </Space>
            </Radio.Group>

            <Button 
              className="pay-now-btn" 
              onClick={handlePayment} 
              disabled={processing}
            >
              {processing ? <Spin size="small" /> : `Pay ₹${doctor.feePerConsulatation} Now`}
            </Button>
          </Card>
        </div>
      </div>
    </MyLayout>
  );
};

export default PaymentPage;
