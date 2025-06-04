import React, { useEffect, useMemo, useState } from "react";
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
import EmployeeDetailsCard from "./../EmployeeDetailsCard";
import { assignEmployees } from "./../../queries/task";
import { getSuggestedEmployees } from "./../../queries/task";
import { APP_COLOR } from "./../../theme";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface SuggestionsDialogProps {
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // employeesSuggestions: employeeDatailsCard[];  WILL BE PASSED FROM OUR ALGORITHM
  taskId: string;
  employeesAmount: number;
  taskDate: Date;
  taskBalancePoints: number;
}

const SuggestionsDialog: React.FC<SuggestionsDialogProps> = ({
  open,
  setIsModalOpen,
  // employeesSuggestions,
  taskId,
  employeesAmount,
  taskDate,
  taskBalancePoints,
}) => {
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState<string[]>([]);
  const [suggestedEmployees, setSuggestedEmployees] = useState<
    employeeDatailsCard[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuggestedEmployees = async () => {
      try {
        const response = await getSuggestedEmployees(taskId);
        setSuggestedEmployees(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching suggested employees:", error);
        toast.error("Oops! Something went wrong");
      }
    };

    if (open) {
      setIsLoading(true);
      setApprovedEmployeeIds([]);
      fetchSuggestedEmployees();
    }
  }, [open]);

  const isEnoughEmployees = useMemo(() => {
    return approvedEmployeeIds.length === employeesAmount;
  }, [approvedEmployeeIds, employeesAmount]);

  const handleSave = async () => {
    try {
      await assignEmployees(
        taskId,
        approvedEmployeeIds,
        taskDate,
        taskBalancePoints
      );
      setApprovedEmployeeIds([]);
      setIsModalOpen(false);
      toast.success("Employees successfuly assigned!");
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! Something went wrong");
    }
  };

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
          Our Suggestions ({approvedEmployeeIds.length} / {employeesAmount})
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
            <h4>Our smart algorithm is loading suggestions for you...</h4>
            <BeatLoader />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {suggestedEmployees.map((employee: employeeDatailsCard, index) => (
              <Grid item xs={12} md={6} key={index}>
                <EmployeeDetailsCard
                  mode="suggestion"
                  employee={employee}
                  handleApproveEmployee={handleApproveEmployee}
                  handleRemoveEmployee={handleRemoveEmployee}
                  isDisabled={isEnoughEmployees}
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
          variant='contained'
          onClick={handleSave}
          disabled={!isEnoughEmployees}
          sx={{
            width: 150,
            height: 40.8,
            bgcolor: APP_COLOR.ROYAL_BLUE,
            mx: 2,
            transition: "background-color 0.2s",
            textTransform: "none",

            "&:disabled": {
              bgcolor: "rgba(69, 123, 157, 0.5)",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}>
          Save
        </Button>

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

export default SuggestionsDialog;
