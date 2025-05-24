import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface ExcelUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  open,
  onClose,
  onFileUpload,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
        onClose();
      }
    },
  });

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/employee-template.xlsx";
    link.download = "employee-template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Add New Employees
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            endIcon={<FileDownloadOutlinedIcon />}
            onClick={handleDownloadTemplate}
            sx={{
              textTransform: "none",
              borderRadius: "0.5rem",
              color: "#87B7FF",
              border: "1px solid #87B7FF",
            }}
          >
            Get Template
          </Button>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#e3f2fd" : "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <input {...getInputProps()} />
          <FileUploadOutlinedIcon sx={{ fontSize: 60, color: "#1976d2" }} />
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {isDragActive
              ? "Drop the Excel file here..."
              : "Drag and drop file here\n(Must be .xlsx or .xls, and matching the template)"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelUploadModal;
