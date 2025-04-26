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

// Main App Component
const Router: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const userLevel = connectedUser?.userLevel || 0; // Default to 0 if not logged in
  console.log("User Level:", userLevel); // Debugging line
  

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/dashboard"
        element={
          <PageLayout>
            { userLevel == 2 ? <DashboardPage /> : userLevel == 1 ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <PageLayout>
            { userLevel == 2 ? <CalendarPage /> : userLevel == 1 ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/employees"
        element={
          <PageLayout>
            { userLevel == 2 ? <EmployeesPage /> : userLevel == 1 ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <PageLayout>
            { userLevel == 2 ? <TasksPage /> : userLevel == 1 ? <Navigate to="/profile" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/swaps"
        element={
          <PageLayout>
            { userLevel == 1 ? <EmployeeSwapsPage /> : userLevel == 2 ? <ManagerSwapsPage /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PageLayout>
            { userLevel == 1 ? <ProfilePage /> : userLevel == 2 ? <Navigate to="/dashboard" /> : <Navigate to="/login" /> }
          </PageLayout>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default Router;
