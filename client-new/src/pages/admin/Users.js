import React, { useEffect, useState } from "react";
import MyLayout from '../../components/layout'
import axios from 'axios'
import { Table } from "antd";

const Users = () => {
    const [users, setUsers] = useState([])

    //getUsers
    const getUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // DEBUG: Log the token
            console.log('Token exists:', !!token);
            console.log('Token length:', token ? token.length : 0);
            console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
            
            if (!token) {
                console.log('No token found in localStorage');
                return;
            }

            console.log('Making request to /api/v1/admin/getAllUsers');
            
            const res = await axios.get('/api/v1/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            if (res.data.success) {
                setUsers(res.data.data)
                console.log('Users fetched successfully:', res.data.data.length);
            } else {
                console.log('Error:', res.data.message)
            }
        } catch (error) {
            console.log('Full error object:', error);
            console.log('Error response:', error.response?.data);
            console.log('Error status:', error.response?.status);
            console.log('Error headers:', error.response?.headers);
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    //antD table columns
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
            title: 'Admin',
            dataIndex: 'isAdmin',
            render: (isAdmin) => isAdmin ? 'Yes' : 'No'
        },
        {
            title: 'Doctor',
            dataIndex: 'isDoctor', 
            render: (isDoctor) => isDoctor ? 'Yes' : 'No'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="d-flex">
                    <button className="btn btn-danger">Block</button>
                </div>
            )
        },
    ]

    return (
        <MyLayout>
            <h1 className="text-center m-2">User List</h1>
            <Table columns={columns} dataSource={users} />
        </MyLayout>
    )
}

export default Users