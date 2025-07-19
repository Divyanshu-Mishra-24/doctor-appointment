import React from "react";
import MyLayout from "../components/layout";
import { message, Tabs } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//read notification
const NotificationPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const handleMarkALlRead = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/get-all-notification', { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
            }
            else {
                message.error(res.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went Wrong')
        }
        
    }

    //delete notifcation
    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/delete-all-notification', { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
            }
            else {
                message.error(res.data.message)
            }

        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went Wrong')
        }
        
    }


    return (
        <MyLayout>
            <h1 className="p-3 text-center">Notification Page</h1>
            <Tabs>
                <Tabs.TabPane tab='Un-Read' key={0}>
                    <div className="d-flex justify-content-end">
                        <h4 className="p-2 text-primary" style={{cursor:'pointer'}} onClick={handleMarkALlRead}>Mark all Read</h4>
                    </div>
                    {
                        user?.notification.map(notificationMSG => (
                            <div className="card" style={{ cursor: "pointer" }}>
                                <div className="card-text " onClick={navigate(notificationMSG.onClickPath)}>
                                    {notificationMSG.message}
                                </div>
                            </div>
                        ))
                    }
                </Tabs.TabPane>
                <Tabs.TabPane tab='Read' key={1}>
                    <div className="d-flex justify-content-end">
                        <h4 className="p-2 text-primary" style={{cursor:'pointer'}} onClick={handleDeleteAllRead}>Delete all Read</h4>
                    </div>
                    {
                        user?.seennotification.map(notificationMSG => (
                            <div className="card" style={{ cursor: "pointer" }}>
                                <div className="card-text " onClick={navigate(notificationMSG.onClickPath)}>
                                    {notificationMSG.message}
                                </div>
                            </div>
                        ))
                    }
                </Tabs.TabPane>
            </Tabs>
        </MyLayout>
    )
}

export default NotificationPage