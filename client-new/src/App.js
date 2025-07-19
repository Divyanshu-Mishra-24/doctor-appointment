import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Homepg';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';
import ApplyDoctor from './pages/ApplyDoctor';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointment from './pages/doctor/DoctorAppointments';
// import Profile from './pages/Profile';
import ProfilePage from './pages/ProfilePage';
import DoctorsPage from './pages/DoctorsPage';
import Information from './pages/doctor/Infomation';
import DoctorProfile from './pages/DoctorProfile';


function App() {
  const { loading } = useSelector(state => state.alert)
  return (
    <>
      <BrowserRouter>
        {loading ? (<Spinner />) :
          (<Routes>
            <Route path='/'
              element={
                <ProtectedRoutes><HomePage /></ProtectedRoutes>
              }></Route>

            <Route path='/Login'
              element={
                <PublicRoutes><Login /></PublicRoutes>
              }></Route>

            <Route path='/Register'
              element={
                <PublicRoutes><Register /></PublicRoutes>
              }></Route>

            <Route path='/apply-doctor'
              element={
                <ProtectedRoutes><ApplyDoctor /></ProtectedRoutes>
              }></Route>

            <Route path='/notification'
              element={
                <ProtectedRoutes><NotificationPage /></ProtectedRoutes>
              }></Route>

            <Route path='/admin/users'
              element={
                <ProtectedRoutes><Users /></ProtectedRoutes>
              }></Route>

              <Route path='/doctor/profile/:id'
              element={
                <ProtectedRoutes><Profile/></ProtectedRoutes>
              }></Route>

            <Route path='/admin/doctors'
              element={
                <ProtectedRoutes><Doctors /></ProtectedRoutes>
              }></Route>

              <Route path='/doctor/book-appointment/:doctorId'
              element={
                <ProtectedRoutes><BookingPage/></ProtectedRoutes>
              }></Route>

              <Route path='/appointments'
              element={
                <ProtectedRoutes><Appointments/></ProtectedRoutes>
              }></Route>

              <Route path='/doctor-appointments'
              element={
                <ProtectedRoutes><DoctorAppointment/></ProtectedRoutes>
              }></Route>

              <Route path='/profile'
              element={
                <ProtectedRoutes><ProfilePage/></ProtectedRoutes>
              }></Route>

              <Route path='/doctors'
              element={
                <ProtectedRoutes><DoctorsPage/></ProtectedRoutes>
              }></Route>

              <Route path='/doctor/info/:id'
              element={
                <ProtectedRoutes><Information/></ProtectedRoutes>
              }></Route>

              <Route path='/doctorProfile/:id'
              element={
                <ProtectedRoutes><DoctorProfile/></ProtectedRoutes>
              }></Route>

          </Routes>)
        }

      </BrowserRouter>
    </>
  );
}

export default App;
