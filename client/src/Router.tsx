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
import { useGlobalContext } from "./contexts/GlobalContext";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import { userLevels } from "./consts";

// Main App Component
const Router: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const userLevel = connectedUser?.userLevel || 0; // Default to 0 if not logged in  

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/dashboard"
        element={
          <PageLayout>
            { userLevel == userLevels.manager ? <DashboardPage /> : userLevel == userLevels.employee ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <PageLayout>
            { userLevel == userLevels.manager ? <CalendarPage /> : userLevel == userLevels.employee  ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/employees"
        element={
          <PageLayout>
            { userLevel == userLevels.manager ? <EmployeesPage /> : userLevel == userLevels.employee  ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <PageLayout>
            { userLevel == userLevels.manager ? <TasksPage /> : userLevel == userLevels.employee  ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/swaps"
        element={
          <PageLayout>
            { userLevel == userLevels.employee  ? <EmployeeSwapsPage /> : userLevel == userLevels.manager ? <ManagerSwapsPage /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PageLayout>
            { userLevel == userLevels.employee  ? <ProfilePage /> : userLevel == userLevels.manager ? <Navigate to="/dashboard" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default Router;
