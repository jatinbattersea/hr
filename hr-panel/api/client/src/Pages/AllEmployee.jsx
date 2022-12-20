import React, { useEffect, useState, useRef } from 'react';
import TeamLeader from './../Components/TeamLeader';
import Candidate from './../Components/Candidate';
import axios from 'axios';
import swal from 'sweetalert';
import PageTitle from '../Components/PageTitle';

const initialValues = {
  profileImage: '',
  name: '',
  designation: '',
  team: '',
  doj: '',
  employeeID: '',
  password: '',
  phone: '',
  email: '',
  dob: '',
  address: '',
  bankName: '',
  accNo: '',
  ifsc: '',
  shift: '',
};

const AllEmployee = () => {

  const [employees, setEmployees] = useState([]);

  const [shifts, setShifts] = useState([]);

  const [values, setValues] = useState(initialValues);

  const [shiftName, setShiftName] = useState("");

  const [fileURL, setFileURL] = useState('');
  const file = useRef(null);
  
  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/user');
      setEmployees(data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  useEffect(() => {
    const getShifts = async () => {
      try {
        const { data } = await axios.get("/api/shift");
        setShifts(data);
      } catch (error) {
        console.log(error);
      }
    }
    getShifts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleShiftChange = async (e) => {
    const { value } = e.target;
    setShiftName(value);
    try {
      const { data } = await axios.get(`api/shift/${value}`);
      setValues({
        ...values,
        shift: data
      })
    } catch (error) {
      console.log(error);
    }
  }

  const getUser = async (Id) => {
    try {
      const { data } = await axios.get(`/api/user/${Id}`);
      setFileURL(data.profileImage);
      setValues(data);
      setShiftName(data.shift.name);
    } catch (err) {
      console.log(err);
    }
  }

  const clearImage = () => {
    setFileURL('');
    file.current.value = null;
  }

  const genertaPassword = (event) => {
    event.preventDefault();
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 6;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    setValues({
      ...values,
      password: password
    })
  }

  const handleUpdateMember = async (event) => {
    event.preventDefault();
    const userData = values;
    if (file.current.value !== "") {
      const data = new FormData();
      const fileName = Date.now() + file.current.files[0]?.name;
      userData.profileImage = fileName;
      data.append("name", fileName);
      data.append("file", file.current.files[0]);
      try {
        await axios.post("/api/user/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.put(`/api/user/${values._id}`, userData).then((response) => {
        if (response.data == "User has been updated") {
          swal({
            title: "User Updated successfully!",
            icon: "success",
            button: "ok",
          });
          setValues(initialValues);
          setFileURL('');
          file.current.value = null;
          getUsers()
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/user/${id}`).then((response) => {
        if (response.data == "User has been deleted") {
          swal({
            title: "User Deleted successfully!",
            icon: "success",
            button: "ok",
          });
          getUsers()
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <main id="main" className="main">
        <PageTitle />
        {/* End Page Title */}
        <section className="section dashboard">
          {employees.length > 0 ? (
            <>
              <div className="row">
                {employees.map(
                  (employee) =>
                    employee.designation == "Team Leader" && (
                      <TeamLeader
                        key={employee._id}
                        details={employee}
                        getUser={getUser}
                        deleteUser={deleteUser}
                      />
                    )
                )}
              </div>

              <div className="row">
                {employees.map(
                  (employee) =>
                    employee.designation != "Team Leader" && (
                      <Candidate
                        key={employee._id}
                        details={employee}
                        getUser={getUser}
                        deleteUser={deleteUser}
                      />
                    )
                )}
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
          {values && (
            <div className="modal fade" id="modalDialogScrollable">
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Edit Details</h4>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body text-start">
                    <form encType="multipart/form-data">
                      <div className="container">
                        <div className="col-lg-12 mb-4">
                          <div className="form-group row">
                            <div className="col-lg-4">
                              <label className="mb-3">Upload Photo</label>
                              <img
                                id="frame"
                                src={
                                  values.profileImage != ""
                                    ? `http://localhost:5000/api/images/` +
                                      values.profileImage
                                    : fileURL && URL.createObjectURL(fileURL)
                                }
                                className="img-fluid mb-2"
                              />
                              <input
                                className="form-control"
                                type="file"
                                name="profileImage"
                                id="formFile"
                                ref={file}
                                onChange={(event) => {
                                  setFileURL(event.target.files[0]);
                                  setValues({
                                    ...values,
                                    profileImage: "",
                                  });
                                }}
                              />
                              <button
                                className="btn btn-danger mt-3"
                                onClick={clearImage}
                              >
                                Remove Photo
                              </button>
                            </div>

                            <div className="col-lg-4">
                              <label className="mb-3">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={values.name}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Designation</label>
                              <select
                                className="form-select"
                                name="designation"
                                value={values.designation}
                                onChange={handleInputChange}
                              >
                                <option>---Select Position---</option>
                                <option value="Manager">Manager</option>
                                <option value="Team Leader">Team Leader</option>
                                <option option="Web Developer">
                                  Web Developer
                                </option>
                                <option value="Senior Web Developer">
                                  Senior Web Developer
                                </option>
                                <option value="Web Designer">
                                  Web Designer
                                </option>
                                <option value="Senior Web Designer">
                                  Senior Web Designer
                                </option>
                                <option value="SEO Executive">
                                  SEO Executive
                                </option>
                                <option value="Senior SEO Executive">
                                  Senior SEO Executive
                                </option>
                                <option value="Content Writer">
                                  Content Writer
                                </option>
                                <option value="Senior Content">
                                  Senior Content Writer
                                </option>
                                <option value="Video Editor">
                                  Video Editor
                                </option>
                                <option value="Senior Video Editor">
                                  Senior Video Editor
                                </option>
                              </select>
                            </div>
                            <div className="col-lg-4 mt-4">
                              <label className="mb-3">Team</label>
                              <select
                                className="form-select"
                                name="team"
                                value={values.team}
                                onChange={handleInputChange}
                              >
                                <option>---Select Team---</option>
                                <option value="Web Development">
                                  Web Development
                                </option>
                                <option value="SEO">SEO</option>
                                <option value="Content Writer">
                                  Content Writer
                                </option>
                              </select>
                            </div>

                            <div className="col-lg-4 mt-4">
                              <label className="mb-3">Date of Joining</label>
                              <input
                                type="date"
                                className="form-control"
                                name="doj"
                                value={values.doj}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-4 mt-4">
                              <label className="mb-3">Employee ID</label>
                              <input
                                type="text"
                                className="form-control"
                                name="employeeID"
                                value={values.employeeID}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-4 mt-4">
                              <label htmlFor="" className="mb-3">
                                Password
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Employee ID"
                                name="password"
                                value={values.password}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="col-lg-4 mt-4">
                              <div className="h-100 d-flex align-items-end">
                                <button
                                  className="btn btn-primary"
                                  onClick={genertaPassword}
                                >
                                  <i className="bi bi-magic"></i>&nbsp; Generate
                                  Password
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <div className="col-lg-12 mb-4">
                          <h5 className="mb-4 mt-4">Edit Personal Details</h5>

                          <div className="form-group row">
                            <div className="col-lg-4">
                              <label className="mb-3">Phone</label>
                              <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={values.phone}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Birthday</label>
                              <input
                                type="date"
                                className="form-control"
                                name="dob"
                                value={values.dob}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-12 mt-4">
                              <label className="mb-3">Address</label>
                              <textarea
                                className="form-control"
                                id=""
                                cols="30"
                                rows="3"
                                name="address"
                                value={values.address}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="col-lg-12 mb-4">
                          <h5 className="mb-4 mt-4">Edit Bank Information</h5>

                          <div className="form-group row">
                            <div className="col-lg-4">
                              <label className="mb-3">Bank Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="bankName"
                                value={values.bankName}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Bank Account No.</label>
                              <input
                                type="text"
                                className="form-control"
                                name="accNo"
                                value={values.accNo}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">IFSC Code</label>
                              <input
                                type="text"
                                className="form-control"
                                name="ifsc"
                                value={values.ifsc}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="col-lg-12 mb-4">
                          <h5 className="mb-4 mt-4">Edit Shift</h5>

                          <div className="form-group row">
                            <div className="col-lg-4">
                              <select
                                className="form-select"
                                name="shift"
                                value={shiftName}
                                onChange={handleShiftChange}
                                required
                              >
                                <option>--- Select Shift ---</option>
                                {shifts.map((shift) => (
                                  <option key={shift._id} value={shift.name}>
                                    {shift.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={handleUpdateMember}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AllEmployee;