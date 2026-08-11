import "./Dashboard.css";

function LabDashboard(){

return(

<div className="dashboard">

<h1>

Lab Dashboard

</h1>

<div className="cardContainer">

<div className="dashboardCard">

<h2>

Bookings

</h2>

<p>

Today's bookings

</p>

</div>

<div className="dashboardCard">

<h2>

Pending Tests

</h2>

<p>

Tests waiting

</p>

</div>

<div className="dashboardCard">

<h2>

Completed Tests

</h2>

<p>

Finished reports

</p>

</div>

<div className="dashboardCard">

<h2>

Upload Reports

</h2>

<p>

Upload patient reports

</p>

</div>

</div>

</div>

)

}

export default LabDashboard;