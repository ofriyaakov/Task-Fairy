import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Divider
} from '@mui/material';
import { employeeDatailsCard } from './../../types/employee'
import EmployeeDetailsCard from './../EmployeeDetailsCard'

interface SuggestionsDialogProps {
    open: boolean;
    onClose: () => void;
    //   employees: employeeDatailsCard[];
    onSave: () => void;
}

const SuggestionsDialog: React.FC<SuggestionsDialogProps> = ({
    open,
    onClose,
    //   employees, 
    onSave
}) => {
    const [approvedEmployees, setApprovedEmployees] = useState<employeeDatailsCard[]>([])

    const employeesSuggestions: employeeDatailsCard[] = [
        {
            firstName: "Ofri",
            lastName: "Yaakov",
            employeeId: "1111111111",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        },
        {
            firstName: "Ofri2",
            lastName: "2",
            employeeId: "22222222",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        },
        {
            firstName: "Ofri3",
            lastName: "3",
            employeeId: "333333333",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        }
    ]

    const handleSave = () => {
        onSave();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const handleApproveEmployee = (employee: employeeDatailsCard) => {
        setApprovedEmployees([...approvedEmployees, employee])
    }

    const handleRemoveEmployee = (deletedEmployee: employeeDatailsCard) => {
        const removeEmployee = approvedEmployees?.filter(employee => employee.employeeId !== deletedEmployee.employeeId)
        setApprovedEmployees(removeEmployee)

    }

    useEffect(() => {
        console.log('approvedEmployees --------- ', approvedEmployees)
    }, [approvedEmployees])




    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: 'rgb(221 238 251)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: "3px solid rgb(69 123 157)",
                    width: "860px",
                    height: "710px"
                }
            }}
        >
            <DialogTitle>
                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        fontWeight: 600,
                        fontSize: 24,
                        mb: 1
                    }}
                >
                    our suggestions
                </Typography>
            </DialogTitle>

            <Divider sx={{ mb: 3 }} style={{ backgroundColor: "rgb(69 123 157)" }} />

            <DialogContent>
                <Grid container spacing={2}>
                    {employeesSuggestions.map((employee: employeeDatailsCard, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <EmployeeDetailsCard
                                employee={employee}
                                handleApproveEmployee={handleApproveEmployee}
                                handleRemoveEmployee={handleRemoveEmployee}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{
                justifyContent: 'space-around',
                mt: 2,
                pb: 3
            }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    style={{
                        width: "215px",
                        height: "56.8px",
                        backgroundColor: "rgb(69 123 157)"
                    }}
                >
                    save
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    style={{
                        width: "215px",
                        height: "56.8px",
                        backgroundColor: "white",
                        color: "rgb(69 123 157)",
                        border: "1px solid rgb(69 123 157)",
                    }}
                >
                    cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuggestionsDialog;