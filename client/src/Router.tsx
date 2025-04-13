import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./views/Registration";
import DashboardPage from "./views/DashboardPage/DashboardPage";
import Login from "./views/LoginPage/Login";
import PageLayout from "./components/PageLayout/PageLayout";
import CalendarPage from "./views/CalendarPage/CalendarPage";
import EmployeesPage from "./views/EmployeesPage/EmployeesPage";
import TasksPage from "./views/TasksPage/TasksPage";
import EmployeeSwapsPage from "./views/EmployeeSwapsPage/EmployeeSwapsPage";
import ManagerSwapsPage from "./views/ManagerSwapsPage/ManagerSwapsPage";

// Main App Component
const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/dashboard"
        element={
          <PageLayout>
            <DashboardPage />
          </PageLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <PageLayout>
            <CalendarPage />
          </PageLayout>
        }
      />
      <Route
        path="/employees"
        element={
          <PageLayout>
            <EmployeesPage />
          </PageLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <PageLayout>
            <TasksPage />
          </PageLayout>
        }
      />
      <Route
        path="/employee-swaps"
        element={
          <PageLayout>
            <EmployeeSwapsPage />
          </PageLayout>
        }
      />
      <Route
        path="/manager-swaps"
        element={
          <PageLayout>
            <ManagerSwapsPage />
          </PageLayout>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default Router;
