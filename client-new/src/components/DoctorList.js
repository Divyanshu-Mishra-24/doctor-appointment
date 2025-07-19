import React from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const DoctorList = ({ doctor }) => {
    const navigate = useNavigate()

    return (
        <>
            <div className="card m-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
                <div className="card-header">
                    Dr. {doctor.f_name} {doctor.l_name}
                </div>
                <div className="card-body">
                    <p>
                        <b>Specialization:</b> {doctor.specialization}
                    </p>
                    <p>
                        <b>Experience:</b> {doctor.experience} <b>Years</b>
                    </p>
                    <p>
                        <b>Fees Per Consultation:</b> {doctor.feePerConsulatation}
                    </p>
                    <p>
                        <b>Timings:</b> {
                            doctor.timings && doctor.timings.length >= 2 
                                ? `${doctor.timings[0]} - ${doctor.timings[1]}`
                                : "Not specified"
                        }
                    </p>
                </div>
            </div>
        </>
    )
}

export default DoctorList