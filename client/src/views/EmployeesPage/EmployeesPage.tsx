import React, { useState } from "react";
import { Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ExcelUploadModal from "../../components/UploadEmployeesModal";
import * as XLSX from "xlsx";
import { addNewEmployees } from "../../queries/user";
import { newEmployee } from "../../types/employee";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";

const EmployeesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { connectedUser } = useGlobalContext();
  const company_id = connectedUser?.companyId;

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
          phone_number: '0' + String(row['PHONE NUMBER']).replace(/^0+/, ''),
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

  return (
    <div className="App" style={{ position: "relative", padding: "1rem" }}>
      <Button
        variant="contained"
        color="primary"
        endIcon={<FileUploadOutlinedIcon />}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          textTransform: "none",
          borderRadius: "0.5rem",
          backgroundColor: "#DDEEFB",
          color: "#87B7FF",
          border: "1px solid #87B7FF",
        }}
        onClick={() => setModalOpen(true)}
      >
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
  );
};

export default EmployeesPage;
