import { useState } from "react";
import TaskEmployeesDialog from "../../components/SwapEmployeeModal";

const EmployeeSwapsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentTaskId, setCurrentTaskId] = useState<string>('');
    const [currentTaskDate, setCurrentTaskDate] = useState<Date>(new Date());
    const [currentBalancePoints, setCurrentBalancePoints] = useState<number>(0);

    const handleTaskCardClick = (taskId: string, taskDate: Date, balancePoints: number) => {
        setCurrentTaskId(taskId)
        setIsModalOpen(true)
        setCurrentTaskDate(taskDate)
        setCurrentBalancePoints(balancePoints)
      };

    return (
        <div className='App'>
            Employee Swaps
        <button onClick={() => handleTaskCardClick("9e504d6c-08b7-4273-a6ef-0ab794c47aef", new Date(), 3)}>click</button>
        {isModalOpen && 
            <TaskEmployeesDialog 
            open={isModalOpen} 
            setIsModalOpen={setIsModalOpen} 
            taskId={currentTaskId} 
            employeesAmount={4} 
            taskDate={currentTaskDate} taskBalancePoints={currentBalancePoints} />
        }
        </div>
    );
};
  
export default EmployeeSwapsPage;
  