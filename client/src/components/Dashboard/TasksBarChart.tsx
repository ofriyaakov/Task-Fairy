// TasksBarChart.tsx
import { useEffect, useState } from "react";
import "./TasksBarChart.css";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TasksBarChartValue } from "../../views/DashboardPage/DashboardPage";

interface TasksBarChartProps {
  TasksBarChartValues: TasksBarChartValue[];
}

const TasksBarChart: React.FC<TasksBarChartProps> = ({
  TasksBarChartValues,
}) => {
  return (
    <div className='graphCard'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Tasks amount</h2>
        <span className='text-sm text-gray-500'>Jan 2025</span>
      </div>
      <ResponsiveContainer width='100%' height={250}>
        <BarChart data={TasksBarChartValues}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='group' />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar
            dataKey='percentage'
            fill='#4db4f6'
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksBarChart;
