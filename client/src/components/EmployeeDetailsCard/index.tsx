import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WcIcon from '@mui/icons-material/Wc';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

import { employeeDatailsCard } from '../../types/employee';

interface EmployeeDetailsCardProps {
    employee: employeeDatailsCard;
    handleApproveEmployee: (employee: employeeDatailsCard) => void
    handleRemoveEmployee: (employee: employeeDatailsCard) => void
}

const DetailsCard: React.FC<EmployeeDetailsCardProps> = ({
    employee,
    handleApproveEmployee, handleRemoveEmployee
}) => {

    const [cardBackgroundColor, setCardBackgroundColor] = useState<string>('white')

    const approveEmployee = () => {
        handleApproveEmployee(employee)
        setCardBackgroundColor('rgb(225 247 239)')
    }

    const removeEmployee = () => {
        handleRemoveEmployee(employee)
        setCardBackgroundColor('rgb(247 224 224)')
    }


    return (
        <Box sx={{ p: 2, height: '15vh', width: "356px", border: "2px solid rgb(229 229 229)", borderRadius: "8px", backgroundColor: cardBackgroundColor }}>
            <Grid container direction="column" alignItems="center" >
                <Grid item xs={6} md={6}>
                    <Box display={"flex"}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <PersonIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{employee.firstName} {employee.lastName}, {employee.employeeId}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <HomeIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{employee.city}</Typography>
                                </Box>
                            </Grid>


                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <GroupWorkIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{employee.companyName}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <StarIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{employee.balancePoints} balance points</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <WcIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{employee.gender}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid alignContent={"center"}>
                            <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={approveEmployee}>
                                <Box display="flex" alignItems="center" >
                                    <CheckIcon sx={{ fontSize: 35, color: 'rgb(97 196 83)' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={3} style={{ cursor: 'pointer' }} onClick={removeEmployee} >
                                <Box display="flex" alignItems="center">
                                    <CloseIcon sx={{ fontSize: 35, color: 'rgb(226 86 24)' }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}


export default DetailsCard;