import { Box, Stack, Typography } from "@mui/material";
import SwapRequestCard from "../../components/SwapRequestCard";

const ManagerSwapsPage: React.FC = () => {

  const swapRequests = [
    {
      leftDetails: {
        employeeId: 's2126075',
        employeeFirstName: 'ofri',
        employeeLastName: 'yaakov',
        taskName: 'Contractors Supervision',
        taskStartTime: '2025-04-29 06:07:15.046895',
        taskEndTime: '2025-04-27 19:07:35.951148',
      },
      rightDetails: {
        employeeId: 's1234567',
        employeeFirstName: 'yuval',
        employeeLastName: 'hikry',
        taskName: 'fill buckets',
        taskStartTime: '2025-05-27 19:07:42.171136',
        taskEndTime: '2025-05-27 19:58:42.171136',
      }
    },
    {
      leftDetails: {
        employeeId: 's2126075',
        employeeFirstName: 'ofri',
        employeeLastName: 'yaakov',
        taskName: 'Contractors Supervision',
        taskStartTime: '2025-04-29 06:07:15.046895',
        taskEndTime: '2025-04-27 19:07:35.951148',
      },
      rightDetails: {
        employeeId: 's1234567',
        employeeFirstName: 'yuval',
        employeeLastName: 'hikry',
        taskName: 'Contractors Supervision',
        taskStartTime: '2025-05-27 19:07:42.171136',
        taskEndTime: '2025-05-27 19:58:42.171136',
      }
    },
  ]

  return (
    <div className='App' style={{ height: "95%" }}>
      <Typography sx={{ fontWeight: 650, fontSize: "1.5rem", display: "flex" }}>
        Pending Swaps
      </Typography>
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 2,
          bgcolor: "rgb(250 250 250)",
          height: "100%",
          borderRadius: "24px"
        }}>
        <Stack
          spacing={2}
          sx={{ overflowY: "auto", overflowX: "hidden", height: "80vh", }}>
          {swapRequests.map((swapRequest) => (
            <SwapRequestCard leftDetails={swapRequest.leftDetails} rightDetails={swapRequest.rightDetails} />
          ))}
        </Stack>
      </Box>
    </div>)
};

export default ManagerSwapsPage;
