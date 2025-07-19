import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux'; // ✅ REMOVED useSelector import
import { setUser } from '../redux/features/userSlice';
import MyLayout from "../components/layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState([])
  // Fetch logged-in user data
  const getUserData = async () => {

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      // console.log("User data:", res.data);

      if (res.data.success) {
        setDoctor(res.data.data)
      }

    } catch (error) {
      console.log("Auth failed or server error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <MyLayout>
      <h1 className="text-center">Home page</h1>
      {/* <Row> */}
          {/* {doctor && doctor.map(doctor=>( */}
            {/* <DoctorList doctor={doctor}/> */}
          {/* ))} */}
      {/* </Row> */}
    </MyLayout>
  );
};

export default HomePage;