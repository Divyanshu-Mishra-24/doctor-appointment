import React, { useState, useEffect } from "react";
import MyLayout from '../components/layout';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { DatePicker, message, TimePicker, Button } from "antd";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const BookingPage = () => {
  const { user } = useSelector(state => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const [date, setDate] = useState();
  const [timings, setTimings] = useState(null);

  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        '/api/v1/doctor/getDoctorById',
        { doctorId: params.doctorId },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log("Auth failed or server error:", error.response?.data || error.message);
    }
  };

  const handleBooking = async () => {
    if (!date || !timings) {
      message.warning("Please select both date and time");
      return;
    }

    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");

      const res = await axios.post(
        '/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date,
          time: timings.format("HH:mm")
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      dispatch(hideLoading());
      
      if (res.data.success) {
        message.success(res.data.message);
        setDate(null);
        setTimings(null);
      } else {
        message.error(res.data.message || "Failed to book appointment");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("❌ Booking error:", error);
      
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to book appointment");
      }
    }
  };

  const isTimeInSchedule = (time) => {
    if (!doctor || !doctor.timings || !time) return false;
    
    const [start, end] = doctor.timings;
    const startTime = moment(start, 'HH:mm A');
    const endTime = moment(end, 'HH:mm A');
    const selectedTime = moment(time.format('HH:mm A'), 'HH:mm A');
    
    return selectedTime.isBetween(startTime, endTime, null, '[]');
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

  const getDisabledMinutes = (selectedHour) => {
    if (!doctor || !doctor.timings) return [];
    
    const [start, end] = doctor.timings;
    const startMoment = moment(start, 'HH:mm A');
    const endMoment = moment(end, 'HH:mm A');
    
    if (selectedHour === startMoment.hour()) {
      return Array.from({ length: startMoment.minute() }, (_, i) => i);
    }
    
    if (selectedHour === endMoment.hour()) {
      return Array.from({ length: 60 - endMoment.minute() }, (_, i) => i + endMoment.minute());
    }
    
    return [];
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <MyLayout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctor && (
          <div>
            <h4>Dr. {doctor.f_name} {doctor.l_name}</h4>
            <h4>Fees: ₹{doctor.feePerConsulatation}</h4>
            <h4>Timings: {doctor.timings && `${doctor.timings[0]} - ${doctor.timings[1]}`}</h4>

            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                value={date ? moment(date, 'DD-MM-YYYY') : null}
                onChange={(value) => {
                  setDate(value ? moment(value).format('DD-MM-YYYY') : null);
                }}
                disabledDate={(current) => current && current < moment().startOf('day')}
                placeholder="Select Date"
                size="large"
              />

              <TimePicker
                className="m-2"
                format="hh:mm A"
                use12Hours
                value={timings}
                onChange={(value) => {
                  if (value && isTimeInSchedule(value)) {
                    setTimings(value);
                  } else {
                    message.warning(`Please select time between ${doctor.timings[0]} - ${doctor.timings[1]}`);
                    setTimings(null);
                  }
                }}
                placeholder="Select Time (AM/PM)"
                size="large"
                showNow={false}
                minuteStep={15}
                disabledHours={getDisabledHours}
                disabledMinutes={getDisabledMinutes}
                hideDisabledOptions={true}
              />

              {date && timings && (
                <div className="mt-2 p-2" style={{ 
                  backgroundColor: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px' 
                }}>
                  <strong>Selected Slot:</strong><br />
                  📅 {moment(date, 'DD-MM-YYYY').format('dddd, MMMM Do YYYY')}<br />
                  🕐 {timings.format('hh:mm A')}
                </div>
              )}

              <Button
                type="primary"
                className="mt-3"
                onClick={handleBooking}
                disabled={!date || !timings}
                size="large"
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  height: '45px',
                  fontWeight: 'bold'
                }}
              >
                📅 Book Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
    </MyLayout>
  );
};

export default BookingPage;