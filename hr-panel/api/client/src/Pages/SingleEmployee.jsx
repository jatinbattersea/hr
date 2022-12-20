import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import ProfileImage from '../Public/images/dummy-image.jpg';
import PageTitle from '../Components/PageTitle';

const SingleEmployee = () => {

  const [employee, setEmployee] = useState({});

  const { employeeID } = useParams();

  useEffect(() => {
    const getUserDetails = async () => {
      const { data } = await axios.get(`/api/user/${employeeID}`);
      setEmployee(data);
    }
    getUserDetails();
  }, [])


  return (
    <main id="main" className="main">
      <PageTitle />
      {/*  End Page Title */}
      <section className="section dashboard">
        {Object.keys(employee).length > 0 ? (
          <>
            <div className="row mt-lg-5">
              <div className="col-lg-5">
                <div className="single-profile d-flex align-items-center">
                  <div className="all-e-img">
                    <a href="#">
                      <img
                        src={
                          employee.profileImage
                            ? process.env.REACT_APP_PUBLIC_PATH +
                              employee?.profileImage
                            : ProfileImage
                        }
                      />
                    </a>
                  </div>
                  <div className="single-con mx-4">
                    <h4>{employee?.name}</h4>
                    <p className="mb-0">{employee?.designation}</p>
                    <p>
                      <i>{employee?.department}</i>
                    </p>
                    <p>Date of Joining : {employee?.doj}</p>
                    <p className="mb-0">
                      <b>Employee ID : {employee?.employeeID}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card card-body">
                  <h5 className="pt-3 mb-3">Personal Details</h5>
                  <p>
                    <b>Phone : </b> +91 {employee?.phone}
                  </p>
                  <p>
                    <b>Email : </b> {employee?.email}
                  </p>
                  <p>
                    <b>Birthday : </b> {employee?.dob}
                  </p>
                  <p>
                    <b>Address : </b> {employee?.address}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="row mt-lg-5">
              <div className="col-lg-6">
                <div className="card card-body">
                  <h5 className="pt-3 mb-3">Bank Information</h5>
                  <p>
                    <b>Bank Name : </b>{" "}
                    {employee.bankName ? employee.bankName : "Not Mentioned"}
                  </p>
                  <p>
                    <b>Bank Account No : </b>{" "}
                    {employee.accNo ? employee.accNo : "Not Mentioned"}
                  </p>
                  <p>
                    <b>IFSC Code : </b>{" "}
                    {employee.ifsc ? employee.ifsc : "Not Mentioned"}
                  </p>
                </div>
              </div>
              {/* 
                // TODO:
                <div className="col-lg-6">
                  <div className="card card-body">
                    <h5 className="pt-3 mb-3">Leaves</h5>
                    <p>
                      <b>Annual Leave : </b> 12
                    </p>
                    <p>
                      <b>Receive : </b> 4
                    </p>
                    <p>
                      <b>Remaining : </b> 8
                    </p>
                  </div>
                </div> 
              */}
              <div className="col-lg-6">
                <div className="card card-body">
                  <h5 className="pt-3 mb-3">Shift Details</h5>
                  <p>
                    <b>Shift Name: </b> {employee?.shift.name}
                  </p>
                  <p>
                    <b>Start Time: </b> {employee?.shift.startTime}
                  </p>
                  <p>
                    <b>End Time: </b> {employee?.shift.endTime}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default SingleEmployee;
