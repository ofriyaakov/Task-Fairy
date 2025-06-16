import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import { employeeDatailsCard } from "./../../types/employee";
import { getAssignedEmployees } from "./../../queries/task";
import { APP_COLOR } from "./../../theme";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { FullSwapRequest, SwapRequestPayload } from "../../types/Swap";
import { createNewSwapRequest } from "../../queries/swapRequests";
import EmployeeDetailsCard from "../EmployeeDetailsCard";
import { ShortenedTaskDetails } from "../../types/Task";

interface AssigneesDialogProps {
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: ShortenedTaskDetails;
  taskToSwap: ShortenedTaskDetails;
  isSwapDisabled: boolean;
  openSwapRequests: FullSwapRequest[];
  setSwapRequestsByEmployee?: React.Dispatch<
    React.SetStateAction<FullSwapRequest[]>
  >;
}

const AssigneesDialog: React.FC<AssigneesDialogProps> = ({
  open,
  setIsModalOpen,
  task,
  taskToSwap,
  isSwapDisabled,
  openSwapRequests,
  setSwapRequestsByEmployee,
}) => {
  const [assignedEmployees, setAssignedEmployees] = useState<employeeDatailsCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { connectedUser } = useGlobalContext();

  const fetchAssignedEmployees = async () => {
    try {
        const response = await getAssignedEmployees(task.taskId);
        const filteredAssignees = response.filter((employee: employeeDatailsCard) => employee.user_id !== connectedUser?.id);
        const availableSwapOptions = filteredAssignees.filter((employee: employeeDatailsCard) => {
          return !openSwapRequests.some((swapRequest: FullSwapRequest) => {
            return (
              swapRequest.leftDetails.employeeId === connectedUser?.id &&
              swapRequest.rightDetails.employeeId === employee.user_id &&
              swapRequest.leftDetails.taskId === taskToSwap.taskId &&
              swapRequest.rightDetails.taskId === task.taskId
            );
          });
        })
      setAssignedEmployees(availableSwapOptions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
      toast.error("Oops! Something went wrong");
    }
  }

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchAssignedEmployees();
    }
  }, [open]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createSwapRequest = async (target: employeeDatailsCard) => {
    if (isSwapDisabled) {
      toast.error("You need to choose task to swap first")
    } else {
      try {
        const swapRequest: SwapRequestPayload = {
          requestingUserId: connectedUser?.id!!,
          requestingTaskId: taskToSwap.taskId,
          requestedUserId: target.user_id,
          requestedTaskId: task.taskId,
          date: new Date(),
        };

        await createNewSwapRequest(swapRequest);
        toast.success("Swap request created successfully");

        const newSwapRequest = {
          leftDetails: {
            employeeId: connectedUser!.id,
            employeeFirstName: connectedUser!.firstName ?? "",
            employeeLastName: connectedUser!.lastName ?? "",
            taskId: taskToSwap.taskId,
            taskName: taskToSwap.name ?? "",
            taskStartTime:
              new Date(taskToSwap.startTime).toISOString() ?? "",
            taskEndTime:
              new Date(taskToSwap.endTime).toISOString() ?? "",
          },
          rightDetails: {
            employeeId: target.user_id,
            employeeFirstName: target.first_name,
            employeeLastName: target.last_name,
            taskId: task.taskId,
            taskName: task.name ?? "",
            taskStartTime:
              new Date(task.startTime).toISOString() ?? "",
            taskEndTime:
              new Date(task.endTime).toISOString() ?? "",
          },
          status: "PENDING",
        };

        setSwapRequestsByEmployee?.((prev) => [...prev, newSwapRequest]);

        setIsModalOpen(false);
      } catch (err: any) {
        console.error(err.message);
        toast.error("Oops! Something went wrong");
      }
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: APP_COLOR.WHITE,
          borderRadius: "12px",
          padding: "16px",
          width: "860px",
          height: "710px",
        },
      }}>
      <DialogTitle>
        <Typography
          variant='h5'
          align='center'
          sx={{
            fontWeight: 600,
            fontSize: 24,
            mb: 1,
          }}>
          Assigned Employees
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 3 }} style={{ backgroundColor: "rgb(251 251 251)" }} />
      {isSwapDisabled &&
        <Typography
          variant='h5'
          align='center'
          sx={{
            fontWeight: 400,
            fontSize: 20,
            mb: 1,
          }}>
          Select one of your tasks that you would like to swap
        </Typography>
      }
      <DialogContent>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minHeight: "200px",
              flexDirection: "column",
            }}>
            <BeatLoader />
          </Box>
        ) : (
          <>
            {assignedEmployees.length === 0 ? (
              <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "200px",
                  flexDirection: "column",
              }}>
                <Typography>Couldn't find people assigned to this task</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {assignedEmployees.map((employee: employeeDatailsCard, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <EmployeeDetailsCard
                        mode="swap"
                        employee={employee}
                        createSwapRequest={createSwapRequest}
                        isDisable={isSwapDisabled}
                      />
                    </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          mt: 2,
          pb: 3,
        }}>

        <Button
          variant='outlined'
          onClick={handleCancel}
          style={{
            width: "150px",
            height: "40.8px",
            backgroundColor: APP_COLOR.WHITE,
            color: APP_COLOR.CERULEAN_BLUE,
            border: `1px solid ${APP_COLOR.CERULEAN_BLUE}`,
            marginRight: "20px",
            marginLeft: "20px",
            textTransform: "none",
          }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssigneesDialog;
