import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./views/Registration";
import HomePage from "./views/HomePage";
import Login from "./views/LoginPage";
import PageLayout from "./components/PageLayout/PageLayout";

// Main App Component
const Router: React.FC = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Registration />} />
      <Route path='/home' element={
        <PageLayout>
          <HomePage />
        </PageLayout>
        } />
      <Route path='/' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

export default Router;
