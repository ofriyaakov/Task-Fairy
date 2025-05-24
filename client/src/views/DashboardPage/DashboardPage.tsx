import React, { useEffect, useState } from "react";
import BalancePoints from "../../components/Dashboard/BalancePoints";
import RectangleData from './../../components/RectangleData';
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAssignedEmployeesAmount } from './../../queries/user';
import { getUnassignedTasksAmount, getAvgTasksPerWeek } from './../../queries/task';
import { getSwapRequestAmount } from './../../queries/swapRequests';

const DashboardPage: React.FC = () => {

  const { connectedUser } = useGlobalContext();
  const companyId = connectedUser?.companyId || 0
  const month = (new Date()).getMonth() + 1

  const [assignedEmployeesAmount, setAssignedEmployeesAmount] = useState(0);
  const [unassignedTasksAmount, setUnassignedTasksAmount] = useState(0);
  const [avgTasksPerWeek, setAvgTasksPerWeek] = useState(0);
  const [swapRequestAmount, setSwapRequestAmount] = useState(0);

  const fetchAssignedEmployeesAmount = async () => {
      try {
        const fetchedAmount: number = await getAssignedEmployeesAmount(companyId, month);
        setAssignedEmployeesAmount(fetchedAmount)
        return fetchedAmount
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchUnassignedTasksAmount = async () => {
      try {
        const fetchedAmount: number = await getUnassignedTasksAmount(companyId, month);
        setUnassignedTasksAmount(fetchedAmount)
        return fetchedAmount
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchAvgTasksPerWeek = async () => {
      try {
        const fetchedAmount: number = await getAvgTasksPerWeek(companyId, month);
        setAvgTasksPerWeek(Math.round(fetchedAmount))
        return fetchedAmount
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchSwapRequestAmount = async () => {
      try {
        const fetchedAmount: number = await getSwapRequestAmount(companyId, month);
        setSwapRequestAmount(fetchedAmount)
        return fetchedAmount
      } catch (err: any) {
        console.error(err.message);
      }
    };
  
    useEffect(() => {
      fetchAssignedEmployeesAmount();
      fetchUnassignedTasksAmount();
      fetchAvgTasksPerWeek();
      fetchSwapRequestAmount();
    }, [companyId, month]);

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
        <RectangleData title="Employees have tasks" value={assignedEmployeesAmount} color="#FFFFFF" width="260px"/>
        <RectangleData title="Tasks need to be assigned" value={unassignedTasksAmount} color="#FFFFFF" width="260px"/>
        <RectangleData title="Avg task per week" value={avgTasksPerWeek} color="#FFFFFF" width="260px"/>
        <RectangleData title="Swap requests" value={swapRequestAmount} color="#FFFFFF" width="260px"/>
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
