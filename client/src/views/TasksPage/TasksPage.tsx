import { Box } from "@mui/material";
import NewTaskForm from "../../components/NewTaskForm";

const TasksPage: React.FC = () => {
  return (
    <div className='App'>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 2fr" },
          gap: 1,
        }}>
        {/* Left Column */}
        <Box sx={{ width: "100%" }}>
          <NewTaskForm />
        </Box>

        {/* Right Column */}
        <Box></Box>
      </Box>
    </div>
  );
};

export default TasksPage;
