import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
} from "@mui/material";
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const columns = [
  {
    field: "date",
    headerName: "Date",
    type: "date",
    flex: 1,
  },
  {
    field: "timeIn",
    headerName: "Punch In",
    flex: 1,
  },
  {
    field: "timeOut",
    headerName: "Punch Out",
    flex: 1,
  },
];

const initialValues = {
    name: "",
    team: "",
    leaveType: "",
    leaveDate: "",
    returnDate: "",
    reason: "",
    msg: "",
}

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);

  const [rowdata, setData] = useState([]);

  const [values, setValues] = useState(initialValues);

  // ? Setting values of year and month
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }
  
  useEffect(() => {
    const getLateArrivals = async () => {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      let tempData;
      let i = 1;
      let arr = [];
      try {
        const { data } = await axios.get(
          `/api/attendence/${year}/${month}/${user._doc.employeeID}`
        );
        data.map((r) => {
          for (const dateProperty in r.schedule) {
            if (dateProperty != "_id") {
              tempData = {
                id: i,
                date: dateProperty,
                timeIn: r.schedule[dateProperty].timeIn,
                timeOut: r.schedule[dateProperty].timeOut,
                shift: user._doc.shift,
              };

              arr.push(tempData);

              i++;
            }
          }
        });
        const lateArrivalsArray = arr.filter((a) => {
          const time1 = a.shift.startTime;
          const time2 = a.timeIn;

          const [hours1, minutes1] = time1.split(":");

          const [hours2, minutes2] = time2.split(":");

          const date1 = new Date(
            2022,
            0,
            1,
            +hours1,
            +minutes1.match(/\d+/)[0]
          );
          const date2 = new Date(
            2022,
            0,
            1,
            +hours2,
            +(minutes2.match(/\d+/) == null ? "00" : minutes2.match(/\d+/)[0])
          );

          return date2.getTime() > date1.getTime();
        });

        setData(
          lateArrivalsArray.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getLateArrivals();
  }, []);
  
  return (
    <main id="main" className="main">
      <PageTitle />
      {/* End Page Title */}
      <section className="section dashboard">
        <div className="row">
          <div className="col-lg-8 col-md-6">
            <div className="card info-card text-center">
              <div className="card-body pb-0">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <h5 className="card-title">Leave Taken</h5>
                    <div className="d-flex align-items-center justify-content-center mb-2 mt-3">
                      <h6>9</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <h5 className="card-title">Remaining</h5>
                    <div className="d-flex align-items-center justify-content-center mb-2 mt-3">
                      <h6>3</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <button className="btn btn-primary">
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#leave-popup"
                        className="text-white"
                      >
                        Apply Leave
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card info-card">
              <div className="card-body pb-0">
                <h5 className="card-title mb-4">Upcoming Holidays</h5>
                <p className="mb-2 mt-3">25 Dec 2022 - Christmas</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-md-6">
            <div className="card info-card">
              <div className="card-body pb-0">
                <h5 className="card-title mb-3">Late Arrival</h5>
                <Box
                  sx={{
                    height: 375,
                  }}
                >
                  <DataGrid
                    rows={rowdata}
                    columns={columns}
                    pageSize={4}
                    rowsPerPageOptions={[4]}
                    disableSelectionOnClick
                    disableToolbarExport
                    disableDensitySelector
                    disableColumnSelector
                    disableColumnFilter
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        printOptions: { disableToolbarButton: true },
                      },
                    }}
                    sx={{
                      p: 1,
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="modal fade" id="leave-popup">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply Leave</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-start">
              <form action="#" className="row g-3 validation">
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-person-fill"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={user._doc.name}
                          disabled
                        />
                        <div className="invalid-feedback">
                          Please Enter Your Name.
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-microsoft-teams"></i>
                        </span>
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
                          <option value="Content Writer">Content Writer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="mb-3">
                        <b>Select CL/Leave</b>
                      </label>
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-microsoft-teams"></i>
                        </span>
                        <select
                          className="form-select"
                          name="leaveType"
                          value={values.leaveType}
                          required=""
                          onChange={handleInputChange}
                        >
                          <option value="">--- Select CL/Leave ---</option>
                          <option value="CL">CL</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="mb-3">
                        <b>Reason For Leave</b>
                      </label>
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-microsoft-teams"></i>
                        </span>
                        <select
                          className="form-select"
                          name="reason"
                          value={values.reason}
                          required=""
                          onChange={handleInputChange}
                        >
                          <option value="">
                            --- Select Reason For Leave ---
                          </option>
                          <option value="Vacation">Vacation</option>
                          <option value="Sick-Self">Sick - Self</option>
                          <option value="Sick-Family">Sick - Family</option>
                          <option value="Doctor Appointment">
                            Doctor Appointment
                          </option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="" className="mb-3">
                        <b>Leave date</b>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="leaveDate"
                        value={values.leaveDate}
                        required=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="" className="mb-3">
                        <b>Return date</b>
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        className="form-control"
                        value={values.returnDate}
                        required=""
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    name="msg"
                    id="msg"
                    cols="30"
                    rows="3"
                    value={values.msg}
                    onChange={handleInputChange}
                    placeholder="Message Here..."
                  ></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100" type="submit">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EmployeeDashboard;