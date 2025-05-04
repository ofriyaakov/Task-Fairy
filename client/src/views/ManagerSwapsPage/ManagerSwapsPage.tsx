import SwapRequestCard from "../../components/SwapRequestCard";

const ManagerSwapsPage: React.FC = () => {

  const leftDetails = {
    employeeId: 's2126075',
    employeeFirstName: 'ofri',
    employeeLastName: 'yaakov',
    taskName: 'Contractors Supervision',
    taskStartTime: '2025-04-29 06:07:15.046895',
    taskEndTime: '2025-04-27 19:07:35.951148',
  }
  const rightDetails = {
    employeeId: 's1234567',
    employeeFirstName: 'yuval',
    employeeLastName: 'hikry',
    taskName: 'fill buckets',
    taskStartTime: '2025-05-27 19:07:42.171136',
    taskEndTime: '2025-05-27 19:58:42.171136',
  }

  return <div className='App'>
    <div>
      Manager Swaps
    </div>
    <SwapRequestCard leftDetails={leftDetails} rightDetails={rightDetails} />
  </div>;
};

export default ManagerSwapsPage;
