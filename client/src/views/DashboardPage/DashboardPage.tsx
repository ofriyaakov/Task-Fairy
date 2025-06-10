import React, { useEffect, useState } from "react";
import BalancePoints from "../../components/Dashboard/BalancePoints";
import RectangleData from "./../../components/RectangleData";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAssignedEmployeesAmount } from "./../../queries/user";
import {
  getUnassignedTasksAmount,
  getAvgTasksPerWeek,
  getAssignStats,
  getTaskPercentageByGroup,
} from "./../../queries/task";
import { getSwapRequestAmount } from "./../../queries/swapRequests";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { INDICATION_COLOR, APP_COLOR } from "../../theme";
import TasksBarChart from "../../components/Dashboard/TasksBarChart";
import { toast } from "react-toastify";

export interface TasksBarChartValue {
  group: string;
  percentage: number;
}
const DashboardPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const companyId = connectedUser?.companyId || 0;

  const [assignedEmployeesAmount, setAssignedEmployeesAmount] = useState(0);
  const [unassignedTasksAmount, setUnassignedTasksAmount] = useState(0);
  const [avgTasksPerWeek, setAvgTasksPerWeek] = useState(0);
  const [swapRequestAmount, setSwapRequestAmount] = useState(0);
  const [tasksChartData, setChartData] = useState<any[]>([]);
  const [totalTasks, setTotal] = useState(0);
  const [tasksBarChart, setTasksBarChart] = useState<TasksBarChartValue[]>([]);

  const fetchGroupBalancePointsData = async () => {
    try {
      const companyId = connectedUser?.companyId || 0;
      const data = await getTaskPercentageByGroup(companyId);
      setTasksBarChart(data);
    } catch (error) {
      console.error("Error fetching balance points:", error);
      toast.error("Oops! Something went wrong");
    }
  };

  const fetchAssignedEmployeesAmount = async () => {
    try {
      const fetchedAmount: number = await getAssignedEmployeesAmount(companyId);
      setAssignedEmployeesAmount(fetchedAmount);
      return fetchedAmount;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchUnassignedTasksAmount = async () => {
    try {
      const fetchedAmount: number = await getUnassignedTasksAmount(companyId);
      setUnassignedTasksAmount(fetchedAmount);
      return fetchedAmount;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchAvgTasksPerWeek = async () => {
    try {
      const fetchedAmount: number = await getAvgTasksPerWeek(companyId);
      setAvgTasksPerWeek(Math.round(fetchedAmount));
      return fetchedAmount;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchSwapRequestAmount = async () => {
    try {
      const fetchedAmount: number = await getSwapRequestAmount(companyId);
      setSwapRequestAmount(fetchedAmount);
      return fetchedAmount;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchAssignStatus = async () => {
    try {
      const response = await getAssignStats(companyId);
      const chartDataToFill = [
        { name: "Done", value: Number(response.fully_assigned_tasks) },
        { name: "In progress", value: Number(response.under_assigned_tasks) },
        { name: "Unassigned", value: Number(response.zero_assigned_tasks) },
      ];
      setChartData(chartDataToFill);

      setTotal(
        Number(response.fully_assigned_tasks) +
          Number(response.under_assigned_tasks) +
          Number(response.zero_assigned_tasks)
      );

      return chartDataToFill;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAssignedEmployeesAmount();
    fetchUnassignedTasksAmount();
    fetchAvgTasksPerWeek();
    fetchSwapRequestAmount();
    fetchAssignStatus();
    fetchGroupBalancePointsData();
  }, [companyId]);

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
        style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 20px 0" }}
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
          flexGrow: 0,
        }}
      >
        <RectangleData
          title="Employees have tasks"
          value={assignedEmployeesAmount}
          color="#FFFFFF"
          width="25%"
        />
        <RectangleData
          title="Tasks need to be assigned"
          value={unassignedTasksAmount}
          color="#FFFFFF"
          width="25%"
        />
        <RectangleData
          title="Avg task per week"
          value={avgTasksPerWeek}
          color="#FFFFFF"
          width="25%"
        />
        <RectangleData
          title="Swap requests"
          value={swapRequestAmount}
          color="#FFFFFF"
          width="25%"
        />
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
          <TasksBarChart TasksBarChartValues={tasksBarChart} />
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
          <BalancePoints />
        </div>

        {/* Right side - Pie Chart */}
        <div
          className="pie-chart-card"
          style={{
            minHeight: "100px",
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 20px 0px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ marginTop: "-15px", marginBottom: "-10px" }}>
            Task Assignment Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tasksChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {tasksChartData.map((entry, index) => {
                  let fillColor = "#000";

                  if (entry.name === "Done") {
                    fillColor = INDICATION_COLOR.BEST;
                  } else if (entry.name === "In progress") {
                    fillColor = "#FFC198";
                  } else if (entry.name === "Unassigned") {
                    fillColor = APP_COLOR.ALICE_BLUE_DARKER;
                  }

                  return <Cell key={index} fill={fillColor} />;
                })}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${((value / totalTasks) * 100).toFixed(0)}%`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
