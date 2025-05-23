import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import WcIcon from '@mui/icons-material/Wc';

import { employeeDatailsCard } from '../../types/employee';

interface SwapEmployeeDetailsCardProps {
    employee: employeeDatailsCard;
    handleApproveEmployee: (employeeId: string) => void
    handleRemoveEmployee: (employeeId: string) => void
    isDisable: boolean;
}

const SwapEmployeeDetailsCard: React.FC<SwapEmployeeDetailsCardProps> = ({
    employee,
    handleApproveEmployee,
    handleRemoveEmployee,
    isDisable
}) => {

    const [cardBackgroundColor, setCardBackgroundColor] = useState<string>('#f5f5f5')

    const createSwapRequest = () => {
        if (isDisable) {
            console.log("Swap request is disabled");
            return;
        }
        // Logic to create a swap request
        console.log("Swap request created for employee:", employee.user_id);
    }

    return (
        <Badge
            badgeContent="Request Swap" 
            overlap="rectangular" 
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClick={createSwapRequest}
            sx={{
                display: "inline-block",
                "& .MuiBadge-badge": {
                  right: 12,
                  top: 12,
                  transform: "scale(1.5)",
                  transformOrigin: "100% 0%",  
                  fontSize: "0.75rem",
                  minWidth: "24px",
                  height: "24px",
                  borderRadius: "12px",
                  padding: "0 6px",
                  backgroundColor: "red",
                  boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",

                  '&:hover': {
                    backgroundColor: 'rgba(88, 145, 211, 0.27)',
                    cursor: 'pointer'
                  }
                }
              }} > 
            <Box
                sx={{
                    p: 2,
                    height: '15vh',
                    width: '356px',
                    border: '2px solid rgb(229 229 229)',
                    borderRadius: '8px',
                    backgroundColor: cardBackgroundColor,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease-in-out',
                }}>
                <Grid container direction="column" alignItems="center" >
                    <Grid item xs={6} md={6}>
                        <Box display={"flex"}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center">
                                        <PersonIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                        <Typography variant="body1">{employee.first_name} {employee.last_name}, {employee.group_name}</Typography>
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
                                        <StarIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                        <Typography variant="body1">{employee.balance_points || 0} balance points</Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={9}>
                                    <Box display="flex" alignItems="center">
                                        <WcIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                        <Typography variant="body1">{employee.gender}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Badge>
    );
}


export default SwapEmployeeDetailsCard;