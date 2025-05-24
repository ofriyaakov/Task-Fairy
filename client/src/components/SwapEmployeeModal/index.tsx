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
import { getAssignedEmployeesPerTask } from "./../../queries/task";
import { APP_COLOR } from "./../../theme";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import SwapEmployeeDetailsCard from "../SwapEmployeeDetailsCard";

interface AssigneesDialogProps {
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // employeesSuggestions: employeeDatailsCard[];  WILL BE PASSED FROM OUR ALGORITHM
  taskId: string;
  employeesAmount: number;
  taskDate: Date;
  taskBalancePoints: number;
}

const AssigneesDialog: React.FC<AssigneesDialogProps> = ({
  open,
  setIsModalOpen,
  // employeesSuggestions,
  taskId,
  employeesAmount,
  taskDate,
  taskBalancePoints,
}) => {
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState<string[]>([]);
  const [assignedEmployees, setAssignedEmployees] = useState<employeeDatailsCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAssignedEmployees = async () => {
    try {
        const response = await getAssignedEmployeesPerTask(taskId);
        setAssignedEmployees(response);
        setIsLoading(false);
    } catch (error) {
        console.error("Error fetching assigned employees:", error);
        toast.error("Oops! Something went wrong");
    }
  }

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setApprovedEmployeeIds([]);
      fetchAssignedEmployees();
    }
  }, [open]);
   
  const handleCancel = () => {
    setApprovedEmployeeIds([]);
    setIsModalOpen(false);
  };

  const handleApproveEmployee = (employeeId: string) => {
    setApprovedEmployeeIds([...approvedEmployeeIds, employeeId]);
  };

  const handleRemoveEmployee = (deletedEmployeeId: string) => {
    const removeEmployee = approvedEmployeeIds?.filter(
      (employeeId) => employeeId !== deletedEmployeeId
    );
    setApprovedEmployeeIds(removeEmployee);
  };

  return (
    <Dialog
      open={open}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "white",
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
          <Grid container spacing={2}>
            {assignedEmployees.map((employee: employeeDatailsCard, index) => (
              <Grid item xs={12} md={6} key={index}>
                <SwapEmployeeDetailsCard
                  employee={employee}
                  handleApproveEmployee={handleApproveEmployee}
                  handleRemoveEmployee={handleRemoveEmployee}
                  isDisable={false}
                />
              </Grid>
            ))}
          </Grid>
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
            backgroundColor: "white",
            color: "rgb(69 123 157)",
            border: "1px solid rgb(69 123 157)",
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
