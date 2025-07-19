import MyLayout from '../../components/layout'
import { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";
import moment from "moment";

const DoctorAppointment = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    const getAppointments = async () => {
        try {
            setLoading(true)
            
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('No authentication token found');
                return;
            }

            console.log('Fetching doctor appointments...');
            
            const res = await axios.get('/api/v1/doctor/doctor-appointment', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            console.log('API Response:', res.data);
            
            if (res.data.success) {
                setAppointments(res.data.data || [])
                if (res.data.data?.length === 0) {
                    message.info('No appointments found');
                } else {
                    message.success(`Found ${res.data.data.length} appointments`);
                }
            } else {
                message.error(res.data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.log('Error fetching appointments:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch appointments';
            message.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAppointments()
    }, [])

    //Handle Status
    const handleStatus=async(record,status)=>{
        try {
            const res= await axios.post('/api/v1/doctor/update-status',{appointmentId:record._id,status},
                {headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }

                }
            )
            if(res.data.success){
                message.success(res.data.message)
                getAppointments()
            }
        } catch (error) {
            console.log(error)
            message.error('Something went wrong')
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text) => text ? text.slice(-6) : 'N/A'
        },
        {
            title: 'Patient Name', // Changed from Doctor Name to Patient Name
            dataIndex: 'userInfo',
            render: (text, record) => {
                console.log('Patient Record:', record);
                
                // If userId is populated (object with user details)
                if (record.userId && typeof record.userId === 'object') {
                    if (record.userId.f_name) {
                        return `${record.userId.f_name} ${record.userId.l_name}`
                    }
                }
                
                // If userInfo object has name details
                if (record.userInfo && typeof record.userInfo === 'object') {
                    if (record.userInfo.f_name) {
                        return `${record.userInfo.f_name} ${record.userInfo.l_name}`
                    }
                    if (record.userInfo.firstName) {
                        return `${record.userInfo.firstName} ${record.userInfo.lastName}`
                    }
                }
                
                // If userInfo is a string
                if (typeof record.userInfo === 'string') {
                    return record.userInfo
                }
                
                return 'Patient Name Not Available'
            }
        },
        {
            title: 'Email', // Changed from Phone to Email
            dataIndex: 'email',
            render: (text, record) => {
                // If userId is populated
                if (record.userId && typeof record.userId === 'object' && record.userId.email) {
                    return record.userId.email
                }
                
                // If userInfo has email
                if (record.userInfo && typeof record.userInfo === 'object' && record.userInfo.email) {
                    return record.userInfo.email
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
            dataIndex: "status",
            render: (status) => (
                <span style={{
                    color: status === 'approved' ? 'green' : 
                           status === 'pending' ? 'orange' : 
                           status === 'rejected' ? 'red' : 'black'
                }}>
                    {status || 'pending'}
                </span>
            )
        },
        {
            title:'Actions',
            dataIndex:'actions',
            render:(text,record)=>(
                <div className='d-flex'>
                    {record.status==='pending' && (
                        <div className='d-flex'>
                            <button className='btn btn-success' onClick={()=> handleStatus(record,'approved')}>Approve</button>
                            <button className='btn btn-danger' onClick={()=> handleStatus(record,'reject')}>Decline</button>
                        </div>    
                    )}
                </div>
            )
        }
    ]

    return (
        <MyLayout>
            <div style={{ padding: '20px' }}>
                <h1>My Patient Appointments</h1>
                
                <Table
                    columns={columns}
                    dataSource={appointments}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} appointments`
                    }}
                    locale={{
                        emptyText: loading ? 'Loading...' : 'No appointments found'
                    }}
                />
                
                <button 
                    onClick={getAppointments}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh Appointments
                </button>
            </div>
        </MyLayout>
    )
}

export default DoctorAppointment