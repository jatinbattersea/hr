import React, { useState, useEffect, useRef } from 'react';
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import swal from 'sweetalert';

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
    shiftName: '',
  };

const AddMember = () => {

  const [values, setValues] = useState(initialValues);

  const [shifts, setShifts] = useState([]);

  const [fileURL, setFileURL] = useState('');
  const file = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
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
  

  const handleAddMember = async (event) => {
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
      await axios.post("/api/user/addMember", userData).then((response) => {
        if (response.data.message == "User registered successfully !") {
          swal({
            title: "User registered successfully!",
            icon: "success",
            button: "ok",
          });
          setValues(initialValues);
          setFileURL('');
          file.current.value = null;
        }
      });
    } catch (err) {
        console.log(err)
     }
  };

  return (
    <main id="main" className="main">
      <PageTitle />
      <section className="section">
        <form onSubmit={handleAddMember} encType="multipart/form-data">
          <div className="container">
            <div className="col-lg-12 mb-4">
              <div className="form-group row">
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    Upload Photo
                  </label>
                  <img id="frame" src={(fileURL) && URL.createObjectURL(fileURL)} className="img-fluid" />
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    name="profileImage"
                    ref={file}
                    onChange={
                      (event) => {
                        setFileURL(event.target.files[0]);
                      }
                    }
                  />
                  <button className="btn btn-primary mt-3" onClick={clearImage}>
                    Remove Photo
                  </button>
                </div>

                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    *Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    name="name"
                    value={values.name} onChange={handleInputChange}
                    required
                  
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    *Designation
                  </label>
                  <select className="form-select" name="designation" value={values.designation} onChange={handleInputChange}
                  required>
                    <option>--- Select Position ---</option>
                    <option value="Manager">Manager</option>
                    <option value="Team Leader">Team Leader</option>
                    <option option="Web Developer">Web Developer</option>
                    <option value="Senior Web Developer">Senior Web Developer</option>
                    <option value="Web Designer">Web Designer</option>
                    <option value="Senior Web Designer">Senior Web Designer</option>
                    <option value="SEO Executive">SEO Executive</option>
                    <option value="Senior SEO Executive">Senior SEO Executive</option>
                    <option value="Content Writer">Content Writer</option>
                    <option value="Senior Content">Senior Content Writer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Senior Video Editor">Senior Video Editor</option>
                  </select>
                </div>
                <div className="col-lg-4 mt-4">
                  <label htmlFor="" className="mb-3">
                    *Team
                  </label>
                  <select className="form-select" name="team" value={values.team} onChange={handleInputChange}
                  required>
                    <option defaultValue="">--- Select Team ---</option>
                    <option value="Web Development">Web Development</option>
                    <option value="SEO">SEO</option>
                    <option value="Content Writer">Content Writer</option>
                  </select>
                </div>

                <div className="col-lg-4 mt-4">
                  <label htmlFor="" className="mb-3">
                    *Date of Joining
                  </label>
                  <input type="date" className="form-control" name="doj" value={values.doj} onChange={handleInputChange}
                  required />
                </div>

                <div className="col-lg-4 mt-4">
                  <label htmlFor="" className="mb-3">
                    *Employee ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Employee ID"
                    name="employeeID"
                    value={values.employeeID} onChange={handleInputChange}
                    required
                  
                  />
                </div>

                <div className="col-lg-4 mt-4">
                  <label htmlFor="" className="mb-3">
                   *Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Employee ID"
                    name="password"
                    value={values.password} onChange={handleInputChange}
                    required

                  />
                </div>
                
                <div className="col-lg-4 mt-4">
                  <div className='h-100 d-flex align-items-end'>
                    <button className='btn btn-primary' onClick={genertaPassword}>
                      <i className="bi bi-magic"></i>&nbsp;
                      Generate Password
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
                  <label htmlFor="" className="mb-3">
                    *Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter Phone No."
                    name="phone"
                    value={values.phone} onChange={handleInputChange}
                    required
                  
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    *Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email Id"
                    name="email"
                    value={values.email} onChange={handleInputChange}
                    required
                  
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    *Birthday
                  </label>
                  <input type="date" className="form-control" name="dob" value={values.dob} onChange={handleInputChange}
                  required />
                </div>

                <div className="col-lg-12 mt-4">
                  <label htmlFor="" className="mb-3">
                    *Address
                  </label>
                  <textarea
                    className="form-control"
                    cols="30"
                    rows="3"
                    placeholder="Enter Address"
                    name="address"
                    value={values.address} onChange={handleInputChange}
                    required
                  
                  ></textarea>
                </div>
              </div>
            </div>
            <hr />
            <div className="col-lg-12 mb-4">
              <h5 className="mb-4 mt-4">Edit Bank Information</h5>

              <div className="form-group row">
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Bank Name"
                    name="bankName"
                    value={values.bankName} onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    Bank Account No.
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Bank Account No."
                    name="accNo"
                    value={values.accNo} onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-4">
                  <label htmlFor="" className="mb-3">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter IFSC Code"
                    name="ifsc"
                    value={values.ifsc} onChange={handleInputChange}
                  />
                </div>
              </div>
              <hr />
              <div className="col-lg-12 mb-4">
                <h5 className="mb-4 mt-4">Edit Shift</h5>

                <div className="form-group row">
                  <div className="col-lg-4">
                    <label className='mb-3'>
                      *Choose Shift
                    </label>
                    <select className="form-select" name="shiftName" value={values.shiftName} onChange={handleInputChange}
                      required>
                      <option>--- Select Shift ---</option>
                      {
                        shifts.map((shift) => (
                          <option key={shift._id} value={shift.name}>{shift.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <p className="text-center">
            <button type="submit" className="btn btn-success">
              <i className="bi bi-plus-circle"></i> Add Employee
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default AddMember;