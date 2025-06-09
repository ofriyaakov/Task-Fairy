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
  TextField,
  Typography,
} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
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
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ExcelUploadModal from "../../components/UploadEmployeesModal";
import * as XLSX from "xlsx";
import { addNewEmployees } from "../../queries/user";
import { newEmployee } from "../../types/employee";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const EmployeesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { connectedUser } = useGlobalContext();
  const company_id = connectedUser?.companyId;

  const [avgBalancePoints, setAvgBalancePoints] = useState<number>(0);
  const [employeesData, setEmployeesData] = useState<employeeData[]>([]);
  const [visibleEmployeesData, setVisibleEmployeesData] = useState<
    employeeData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
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

  const onFileUpload = (file: File, company_id: number) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json = XLSX.utils.sheet_to_json<newEmployee>(worksheet);

        const normalized = json.map((row: any) => ({
          user_id: row.ID,
          first_name: row["FIRST NAME"],
          last_name: row["LAST NAME"],
          email: row.EMAIL,
          gender: row.GENDER,
          phone_number: "0" + String(row["PHONE NUMBER"]).replace(/^0+/, ""),
          group_name: row["GROUP NAME"],
        }));

        if (!json.length) {
          toast.error("The uploaded Excel file is empty or invalid.");
          return;
        }

        const result = await addNewEmployees(normalized, company_id);

        const successCount = result.success.length;
        const failCount = result.failed.length;

        if (failCount > 0) {
          toast.warning(
            `Added ${successCount} employees, Failed to add ${failCount}. Check data.`
          );
        } else {
          toast.success(`All ${successCount} employees added successfully.`);
        }
      } catch (err: any) {
        console.error("Upload failed:", err);
        toast.error(err.message || "Failed to process Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
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
    setCurrentPage(1);
  };

  useEffect(() => {
    setLoading(true);
    fetchCompanyAvgBalancePoints();
    fetchEmployeesData();
  }, [company_id]);

  const DeletePopup: React.FC = () => (
    <Dialog
      open={deletePopupOpen}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          width: "25vw",
        },
      }}>
      <IconButton
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={() => {
          handleDialogClose();
        }}>
        <CloseIcon />
      </IconButton>

      <DialogTitle>
        <Typography
          variant='h5'
          align='center'
          sx={{
            fontWeight: 600,
            fontSize: 24,
            mb: 1,
          }}>
          Are you sure you want to delete this employee?
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 1 }} style={{ backgroundColor: "rgb(251 251 251)" }} />

      <DialogContent>
        <Typography
          variant='h4'
          align='center'
          sx={{
            fontWeight: 600,
            fontSize: 24,
          }}>
          {selectedEmployee?.first_name} {selectedEmployee?.last_name}
        </Typography>
        <Typography
          variant='h3'
          align='center'
          sx={{
            fontWeight: 600,
            fontSize: 20,
          }}>
          {selectedEmployee?.group_name}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          mt: 2,
          pb: 3,
        }}>
        <Button
          variant='outlined'
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
          }}>
          Cancel
        </Button>

        <Button
          variant='contained'
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
          }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const columns: GridColDef<employeeData>[] = [
    {
      field: "id",
      headerName: "#",
      width: 90,
      renderCell: (params) => {
        const rowIndex =
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          rowsPerPage * (currentPage - 1);
        return rowIndex + 1; // +1 to start from 1
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "ame",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return `${params.row.first_name} ${params.row.last_name}`;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "group_name",
      headerName: "Association",
      width: 200,
    },
    {
      field: "balance_points",
      headerName: "Balance Points",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={`● ` + (params.row.balance_points ?? 0)}
          style={{
            fontWeight: "bold",
            backgroundColor:
              params.row.balance_points === avgBalancePoints
                ? "#E4E4E4"
                : params.row.balance_points > avgBalancePoints
                ? "#E9FFEF"
                : "#FFDFDF",
            color:
              params.row.balance_points === avgBalancePoints
                ? "#3F3748"
                : params.row.balance_points > avgBalancePoints
                ? "#409261"
                : "#FF6969",
          }}
        />
      ),
    },
    {
      field: "last_task_date",
      headerName: "Last Task",
      width: 200,
      renderCell: (params) =>
        params.row.last_task_date
          ? new Date(params.row.last_task_date).toLocaleDateString("de-CH")
          : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,

      renderCell: (params: { row: SetStateAction<employeeData | null> }) => (
        <img
          src='/delete.svg'
          alt='Delete'
          onClick={() => {
            setSelectedEmployee(params.row);
            setDeletePopupOpen(true);
          }}
          style={{
            cursor: "pointer",
            marginTop: "2vh",
          }}
        />
      ),
    },
  ];

  return (
    <div className='page-container'>
      {loading ? (
        <div className='loader-container'>
          <BeatLoader color='#36d7b7' loading={loading} size={20} />
        </div>
      ) : (
        <>
          <div className='table-container'>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "12px",
              }}>
              <TextField
                label='Search employee'
                variant='outlined'
                size='small'
                onChange={(e) => {
                  handleSerachQueryChange(e.target.value);
                }}
                style={{ width: 250 }}
              />
              <Button
                variant='contained'
                color='primary'
                endIcon={<FileUploadOutlinedIcon />}
                style={{
                  marginLeft: "1rem",
                  textTransform: "none",
                  borderRadius: "0.5rem",
                  backgroundColor: "#DDEEFB",
                  color: "#87B7FF",
                  border: "1px solid #87B7FF",
                }}
                onClick={() => setModalOpen(true)}>
                Upload employees
              </Button>

              <ExcelUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onFileUpload={(file) => {
                  onFileUpload(file, company_id as number);
                }}
              />
            </div>

            <DataGrid
              className='employee-table'
              rows={visibleEmployeesData}
              columns={columns}
              pagination
              paginationMode='client'
              rowCount={visibleEmployeesData.length}
              getRowId={(row) => row.user_id}
              paginationModel={{
                page: currentPage - 1,
                pageSize: rowsPerPage,
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                setCurrentPage(page + 1);
                setRowsPerPage(pageSize);
              }}
            />
          </div>
          <DeletePopup />
        </>
      )}
    </div>
  );
};

export default EmployeesPage;
