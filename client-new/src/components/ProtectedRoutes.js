import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { showLoading, hideLoading } from '../redux/features/alertSlice';

export default function ProtectedRoutes({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Added here
  const { user } = useSelector(state => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/getUserData',
        { token: localStorage.getItem('token') },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        navigate('/login'); // ✅ Changed from JSX to function-based navigation
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate('/login'); // ✅ navigate even on error
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]); // ✅ Corrected dependency array syntax

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
