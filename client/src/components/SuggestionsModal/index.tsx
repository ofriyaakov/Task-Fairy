import React, { useMemo, useState } from 'react';
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
import { assignEmployees } from './../../queries/task'

interface SuggestionsDialogProps {
    open: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // employeesSuggestions: employeeDatailsCard[];  WILL BE PASSED FROM OUR ALGORITHM
    taskId: string; 
    employeesAmount: number;
}

const SuggestionsDialog: React.FC<SuggestionsDialogProps> = ({
    open,
    setIsModalOpen,
    // employeesSuggestions, 
    taskId,
    employeesAmount
}) => {
    const [approvedEmployeeIds, setApprovedEmployeeIds] = useState<string[]>([])

    const isEnoughEmployees = useMemo(() => {
        return approvedEmployeeIds.length === employeesAmount;
    }, [approvedEmployeeIds, employeesAmount]);

    // TO REPLACE AFTER WE HAVE THE ALGORITHM
    const employeesSuggestions: employeeDatailsCard[] = [
        {
            firstName: "Ofri",
            lastName: "Yaakov",
            employeeId: "21260",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        },
        {
            firstName: "Ofri2",
            lastName: "2",
            employeeId: "2126",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        },
        {
            firstName: "Ofri3",
            lastName: "3",
            employeeId: "212",
            companyName: "sigma",
            city: "Afula",
            balancePoints: 10,
            gender: "female"
        }
    ]

    const handleSave = async () => {
        try {
            await assignEmployees(taskId, approvedEmployeeIds)
            setApprovedEmployeeIds([])
            setIsModalOpen(false)
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const handleCancel = () => {
        setApprovedEmployeeIds([])
        setIsModalOpen(false)
    };

    const handleApproveEmployee = (employeeId: string) => {
        setApprovedEmployeeIds([...approvedEmployeeIds, employeeId])
    }

    const handleRemoveEmployee = (deletedEmployeeId: string) => {
        const removeEmployee = approvedEmployeeIds?.filter(employeeId => employeeId !== deletedEmployeeId)
        setApprovedEmployeeIds(removeEmployee)

    }

    return (
        <Dialog
            open={open}
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
                                isDisable={isEnoughEmployees}
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
                    disabled={!isEnoughEmployees}
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