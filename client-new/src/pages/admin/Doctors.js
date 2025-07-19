import React, { useState, useEffect } from "react";
import MyLayout from '../../components/layout'
import axios from 'axios'
import { message, Table } from "antd";

const Doctors = () => {
    const [doctors, setDoctors] = useState([])
    
    const getDoctors = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('No token found in localStorage');
                return;
            }

            const res = await axios.get('/api/v1/admin/getAllDoctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.data.success) {
                setDoctors(res.data.data)
                console.log('Doctors fetched successfully:', res.data.data.length);
            } else {
                console.log('Error:', res.data.message)
            }
        } catch (error) {
            console.log('Full error object:', error);
            console.log('Error response:', error.response?.data);
        }
    }

    //handle Account Status - MAIN FIX HERE
    const handleAccountStatus = async (record, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/v1/admin/changeAccountStatus', 
                { 
                    doctorId: record._id, 
                    status: status 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            
            if (res.data.success) {
                message.success(res.data.message);
                
                // Show additional message for approved doctors
                if (status === 'approved') {
                    message.info('Doctor approved! They need to refresh their browser or re-login to see the doctor menu.', 5);
                }
                
                // Refresh the doctors list
                getDoctors();
            }
        } catch (error) {
            console.log('Error approving doctor:', error);
            message.error('Something went wrong')
        }
    }

    useEffect(() => {
        getDoctors()
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'f_name',
            render: (text, record) => `${record.f_name} ${record.l_name}`
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <span style={{ 
                    color: status === 'approved' ? 'green' : 
                           status === 'pending' ? 'orange' : 'red' 
                }}>
                    {status}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === 'pending' ? (
                        <>
                            <button 
                                className="btn btn-success me-2" 
                                onClick={() => handleAccountStatus(record, 'approved')}
                            >
                                Approve
                            </button>
                            <button 
                                className="btn btn-danger" 
                                onClick={() => handleAccountStatus(record, 'rejected')}
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <span className="text-muted">
                            {record.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                    )}
                </div>
            )
        },
    ]

    return (
        <MyLayout>
            <h1>Doctors List</h1>
            <Table columns={columns} dataSource={doctors} rowKey="_id" />
        </MyLayout>
    )
}

export default Doctors