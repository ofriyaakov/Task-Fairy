import "./EmployeesPage.css";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import {
  deleteUserById,
  getAllCompanyEmployeesData,
  getCompanyAvgBalancePoints,
} from "../../queries/user";
import { BeatLoader } from "react-spinners";
import { employeeData } from "../../types/employee";
import { APP_COLOR } from "../../theme";

const EmployeesPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [avgBalancePoints, setAvgBalancePoints] = useState<number>(0);
  const [employeesData, setEmployeesData] = useState<employeeData[]>([]);
  const [visibleEmployeesData, setVisibleEmployeesData] = useState<
    employeeData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(7);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<employeeData | null>(
    null
  );
  const [deletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);

  const fetchCompanyAvgBalancePoints = async () => {
    try {
      const companyId = connectedUser?.companyId;
      if (!companyId) throw new Error("User ID not found in context");

      const avgBalancePoints: number = await getCompanyAvgBalancePoints(
        companyId
      );
      setAvgBalancePoints(Number(Number(avgBalancePoints).toFixed(1)));
      setLoading(false);
    } catch (err: any) {
      console.error(err.message);
      setLoading(false);
    }
  };

  const fetchEmployeesData = async () => {
    try {
      const companyId = connectedUser?.companyId;
      if (!companyId) throw new Error("User ID not found in context");

      const employeesData: employeeData[] = await getAllCompanyEmployeesData(
        companyId
      );
      setEmployeesData(employeesData);
      setVisibleEmployeesData(employeesData);
      setTotalPages(Math.ceil(employeesData.length / rowsPerPage));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDialogClose = () => {
    setDeletePopupOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    const employeeId = selectedEmployee.user_id;
    try {
      await deleteUserById(employeeId);
      toast.success("Employee deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleDialogClose();
    } catch (err: any) {
      console.error(err.message);
      toast.error("Error deleting employee", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      fetchEmployeesData();
    }
  };

  const getPageButtons = () => {
    const buttons = [];

    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        onClick={() => setCurrentPage(1)}
      >
        01
      </button>
    );

    // Show some pages, then ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis1" className="ellipsis">
          ...
        </span>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          className={`page ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {String(i).padStart(2, "0")}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis2" className="ellipsis">
          ...
        </span>
      );
    }

    // Always show last page if it's not already included
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {String(totalPages).padStart(2, "0")}
        </button>
      );
    }

    return buttons;
  };

  const handleSerachQueryChange = (value: string) => {
    const query = value.toLowerCase();

    const filteredData = employeesData.filter((employee) => {
      return (
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.group_name.toLowerCase().includes(query)
      );
    });
    setVisibleEmployeesData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    setLoading(true);
    fetchCompanyAvgBalancePoints();
    fetchEmployeesData();
  }, []);

  const DeletePopup: React.FC = () => (
    <Dialog
      open={deletePopupOpen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          width: "25vw",
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={() => {
          handleDialogClose();
        }}
      >
        <CloseIcon />
      </IconButton>

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
          Are you sure you want to delete this employee?
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 1 }} style={{ backgroundColor: "rgb(251 251 251)" }} />

      <DialogContent>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: 24,
          }}
        >
          {selectedEmployee?.first_name} {selectedEmployee?.last_name}
        </Typography>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          {selectedEmployee?.group_name}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          mt: 2,
          pb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handleDialogClose();
          }}
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

        <Button
          variant="contained"
          onClick={() => {
            handleDeleteEmployee();
          }}
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className="page-container">
      {loading ? (
        <div className="loader-container">
          <BeatLoader color="#36d7b7" loading={loading} size={20} />
        </div>
      ) : (
        <>
          <div className="table-container">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "12px",
              }}
            >
              <TextField
                label="Search employee"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  handleSerachQueryChange(e.target.value);
                }}
                style={{ width: 250 }}
              />
            </div>

            <Table className="employee-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Association</th>
                  <th>Balance Points</th>
                  <th>Last Task</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployeesData
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    (currentPage - 1) * rowsPerPage + rowsPerPage
                  )
                  .map((row, index) => (
                    <tr key={row.user_id}>
                      <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                      <td>{`${row.first_name} ${row.last_name}`}</td>
                      <td>{row.email}</td>
                      <td>{row.group_name}</td>
                      <td>
                        <Chip
                          label={`● ` + (row.balance_points ?? 0)}
                          style={{
                            fontWeight: "bold",
                            backgroundColor:
                              row.balance_points === avgBalancePoints
                                ? "#E4E4E4"
                                : row.balance_points > avgBalancePoints
                                ? "#E9FFEF"
                                : "#FFDFDF",
                            color:
                              row.balance_points === avgBalancePoints
                                ? "#3F3748"
                                : row.balance_points > avgBalancePoints
                                ? "#409261"
                                : "#FF6969",
                          }}
                        />
                      </td>
                      <td>
                        {row.last_task_date
                          ? new Date(row.last_task_date).toLocaleDateString(
                              "de-CH"
                            )
                          : "-"}
                      </td>
                      <td>
                        <img
                          src="/delete.svg"
                          alt="Delete"
                          onClick={() => {
                            setSelectedEmployee(row);
                            setDeletePopupOpen(true);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <div className="pagination">{getPageButtons()}</div>
          </div>
          <DeletePopup />
        </>
      )}
    </div>
  );
};

export default EmployeesPage;
