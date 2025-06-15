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
import { assignEmployees, unassignEmployees } from "./../../queries/task";
import {
  getSuggestedEmployees,
  getAssignedEmployees,
} from "./../../queries/task";
import { APP_COLOR } from "./../../theme";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface SuggestionsDialogProps {
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
  employeesAmount: number;
  taskDate: Date;
  taskBalancePoints: number;
  setRefreshTasks: (refresh: boolean) => void;
}

const SuggestionsDialog: React.FC<SuggestionsDialogProps> = ({
  open,
  setIsModalOpen,
  taskId,
  employeesAmount,
  taskDate,
  taskBalancePoints,
  setRefreshTasks,
}) => {
  const [approvedEmployees, setApprovedEmployees] = useState<
    employeeDatailsCard[]
  >([]);
  const [suggestedEmployees, setSuggestedEmployees] = useState<
    employeeDatailsCard[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assignedEmployees, setAssignedEmployees] = useState<
    employeeDatailsCard[]
  >([]);
  const [removedEmployees, setRemovedEmployees] = useState<
    employeeDatailsCard[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setApprovedEmployees([]);

        const [suggested, assigned] = await Promise.all([
          getSuggestedEmployees(taskId),
          getAssignedEmployees(taskId),
        ]);

        const scoreMap = new Map(
          suggested.map((emp: employeeDatailsCard) => [emp.user_id, emp.score])
        );

        const assignedWithScores = assigned.map((emp: employeeDatailsCard) => ({
          ...emp,
          score: scoreMap.get(emp.user_id) ?? null,
        }));

        setAssignedEmployees(assignedWithScores);

        const removedIds = new Set(removedEmployees.map((emp) => emp.user_id));

        const assignedIds = new Set(
          assigned.map((emp: employeeDatailsCard) => emp.user_id)
        );

        const filteredSuggestions = suggested.filter(
          (emp: employeeDatailsCard) =>
            !assignedIds.has(emp.user_id) || removedIds.has(emp.user_id)
        );

        setSuggestedEmployees(filteredSuggestions);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Oops! Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSave = async () => {
    try {
      approvedEmployees.length > 0 &&
        (await assignEmployees(
          taskId,
          approvedEmployees.map((employee) => employee.user_id),
          taskDate,
          taskBalancePoints
        ));
      removedEmployees.length > 0 &&
        (await unassignEmployees(
          taskId,
          removedEmployees.map((employee) => employee.user_id),
          taskDate,
          taskBalancePoints
        ));
      setApprovedEmployees([]);
      setRemovedEmployees([]);
      setIsModalOpen(false);
      toast.success("Employees successfuly assigned!");
      setRefreshTasks(true);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! Something went wrong");
    }
  };

  const handleCancel = () => {
    setApprovedEmployees([]);
    setIsModalOpen(false);
  };

  const handleApproveEmployee = (employee: employeeDatailsCard) => {
    const wasOriginallyAssigned = assignedEmployees.some(
      (emp) => emp.user_id === employee.user_id
    );

    const wasRemoved = removedEmployees.some(
      (emp) => emp.user_id === employee.user_id
    );

    if (wasRemoved) {
      setRemovedEmployees((prev) =>
        prev.filter((emp) => emp.user_id !== employee.user_id)
      );
    } else if (!wasOriginallyAssigned) {
      setApprovedEmployees((prev) => {
        if (!prev.find((e) => e.user_id === employee.user_id)) {
          return [...prev, employee];
        }
        return prev;
      });
    }

    setSuggestedEmployees((prev) =>
      prev.filter((emp) => emp.user_id !== employee.user_id)
    );
  };

  const handleRemoveEmployee = (deletedEmployee: employeeDatailsCard) => {
    const removeEmployee = approvedEmployees?.filter(
      (employee) => employee.user_id !== deletedEmployee.user_id
    );
    setApprovedEmployees(removeEmployee);

    const newSuggestedEmployees = [...suggestedEmployees, deletedEmployee].sort(
      (a, b) => {
        return b.score - a.score;
      }
    );
    setSuggestedEmployees(newSuggestedEmployees);

    if (
      assignedEmployees.some(
        (employee) => employee.user_id === deletedEmployee.user_id
      )
    ) {
      setRemovedEmployees([...removedEmployees, deletedEmployee]);
    }
  };

  const rightSideList = useMemo(() => {
    return assignedEmployees
      .filter((emp) => !removedEmployees.some((r) => r.user_id === emp.user_id))
      .concat(approvedEmployees);
  }, [assignedEmployees, approvedEmployees, removedEmployees]);

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          width: "900px",
          height: "710px",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: 24,
            mb: 1,
          }}
        >
          Task Employees
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 3 }} style={{ backgroundColor: "rgb(251 251 251)" }} />

      <DialogContent
        sx={{
          paddingTop: 0,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4>Loading assigned employees and suggestions...</h4>
            <BeatLoader />
          </Box>
        ) : (
          <Box display="flex" gap={2}>
            {/* Suggestions Section */}
            <Box flex={1} overflow="auto">
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  width: "400px",
                  backgroundColor: "#ffffff",
                  position: "fixed",
                  zIndex: 50,
                }}
              >
                Suggestions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {suggestedEmployees.map((employee, index) => (
                  <Grid item xs={12} key={index}>
                    <EmployeeDetailsCard
                      employee={employee}
                      mode="suggestion"
                      handleApproveEmployee={handleApproveEmployee}
                      handleRemoveEmployee={handleRemoveEmployee}
                      isDisable={approvedEmployees.includes(employee)}
                      disableAdd={rightSideList.length >= employeesAmount}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem />

            {/* Already Assigned Section */}
            <Box flex={1} overflow="auto">
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  width: "400px",
                  backgroundColor: "#ffffff",
                  position: "fixed",
                  zIndex: 50,
                }}
              >
                Assigned Employees ({rightSideList.length} / {employeesAmount})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {rightSideList.map((employee, index) => (
                  <Grid item xs={12} key={index}>
                    <EmployeeDetailsCard
                      mode="suggestion"
                      employee={employee}
                      isDisable={true}
                      isSuggestion={false}
                      isAssigned={true}
                      handleRemoveEmployee={handleRemoveEmployee}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          mt: 2,
          pb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            approvedEmployees.length === 0 && removedEmployees.length === 0
          }
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
          }}
        >
          Save
        </Button>

        <Button
          variant="outlined"
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
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuggestionsDialog;
