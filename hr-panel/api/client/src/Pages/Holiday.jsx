import React from "react";
import PageTitle from '../Components/PageTitle';

const Holiday = () => {
  return (
    <main id="main" className="main">
      <PageTitle />
      {/*  End Page Title  */}
      <section className="section dashboard">
        <div className="col-lg-12 ">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">S No.</th>
                <th scope="col">Holiday Name</th>
                <th scope="col">Holiday Date</th>
                <th scope="col">Day</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>New Year</td>
                <td>1 Jan 2022 </td>
                <td>Monday</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Diwali</td>
                <td>24 Oct 2022</td>
                <td>Monday</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Goverdhan</td>
                <td>25 Oct 2022</td>
                <td>Tuesday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Holiday;
