import React from "react";
import BalancePoints from "../../components/Dashboard/BalancePoints";

const DashboardPage: React.FC = () => {
  return (
    <div
      className="dashboard-page"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "40px",
        backgroundColor: "#f9fbfd",
      }}
    >
      {/* Page Title */}
      <h1
        style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}
      >
        Monthly Dashboard
      </h1>

      {/* Top Stat Cards */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
          flexGrow: 0,
        }}
      >
        <div className="stat-card">Employees have tasks</div>
        <div className="stat-card">Tasks need to be assigned</div>
        <div className="stat-card">Avg task per week</div>
        <div className="stat-card">Swap requests</div>
      </div>

      {/* Main Charts Section */}
      <div
        className="charts-grid"
        style={{
          flexGrow: 1, // <--- important to stretch!
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div className="bar-chart-card" style={{ minHeight: "300px" }}>
          Tasks amount (Bar Chart)
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className="bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "20px",
          flexGrow: 1, // <--- important to stretch!
        }}
      >
        {/* Left side - Min/Max/Average Cards */}
        <div
          className="balance-cards"
          style={{
            display: "grid",
            gap: "20px",
            minHeight: "100px",
          }}
        >
          <BalancePoints/>
        </div>

        {/* Right side - Pie Chart */}
        <div className="pie-chart-card" style={{ minHeight: "100px" }}>
          Task Status (Pie Chart)
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
