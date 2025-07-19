import React from "react";
import MyLayout from '../components/layout'
import { useState } from "react";
import axios from "axios";
import { message, Table } from "antd";
import { useEffect } from "react";
import moment from "moment";

const Appointments = () => {

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    const getAppointments = async () => {
        try {
            setLoading(true)
            const res = await axios.get('/api/v1/user/user-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log('API Response:', res.data) // Debug log
            if (res.data.success) {
                setAppointments(res.data.data)
            }
        } catch (error) {
            console.log('Error fetching appointments:', error)
            message.error('Failed to fetch appointments')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAppointments()
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id'
        },
        {
            title: 'Doctor Name',
            dataIndex: 'doctorInfo',
            render: (text, record) => {
                console.log('Record:', record) // Debug log
                
                // If doctorId is populated (object with doctor details)
                if (record.doctorId && typeof record.doctorId === 'object' && record.doctorId.f_name) {
                    return `${record.doctorId.f_name} ${record.doctorId.l_name}`
                }
                
                // If doctorInfo object has name details
                if (record.doctorInfo && typeof record.doctorInfo === 'object') {
                    if (record.doctorInfo.f_name) {
                        return `${record.doctorInfo.f_name} ${record.doctorInfo.l_name}`
                    }
                    if (record.doctorInfo.firstName) {
                        return `${record.doctorInfo.firstName} ${record.doctorInfo.lastName}`
                    }
                }
                
                // If doctorInfo is a string
                if (typeof record.doctorInfo === 'string') {
                    return record.doctorInfo
                }
                
                return 'Doctor Name Not Available'
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: (text, record) => {
                // If doctorId is populated
                if (record.doctorId && typeof record.doctorId === 'object' && record.doctorId.phone_no) {
                    return record.doctorId.phone_no
                }
                
                // If doctorInfo has phone
                if (record.doctorInfo && typeof record.doctorInfo === 'object' && record.doctorInfo.phone) {
                    return record.doctorInfo.phone
                }
                
                return 'N/A'
            }
        },
        {
            title: 'Date and Time',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                    {moment(record.date).format('DD-MM-YYYY')} &nbsp;
                    {moment(record.time).format('HH:mm A')}
                </span>
            )
        },
        {
            title: "Status",
            dataIndex: "status"
        }
    ]

    return (
        <MyLayout>
            <h1>Appointments List</h1>
            <Table 
                columns={columns} 
                dataSource={appointments} 
                loading={loading}
                rowKey="_id"
            />
        </MyLayout>
    )
}

export default Appointments