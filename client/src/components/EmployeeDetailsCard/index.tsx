import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import WcIcon from '@mui/icons-material/Wc';
import { INDICATION_COLOR } from '../../theme';

import { employeeDatailsCard } from '../../types/employee';

interface EmployeeDetailsCardProps {
    employee: employeeDatailsCard;
    handleApproveEmployee: (employeeId: string) => void
    handleRemoveEmployee: (employeeId: string) => void
    isDisable: boolean;
}

const EmployeeDetailsCard: React.FC<EmployeeDetailsCardProps> = ({
    employee,
    handleApproveEmployee,
    handleRemoveEmployee,
    isDisable
}) => {

    const [cardBackgroundColor, setCardBackgroundColor] = useState<string>('#f5f5f5')
    const [isApproved, setIsApproved] = useState<boolean>(false)

    const approveEmployee = () => {
        handleApproveEmployee(employee.user_id)
        setCardBackgroundColor('#e1f4ff')
        setIsApproved(true)
    }

    const removeEmployee = () => {
        handleRemoveEmployee(employee.user_id)
        setCardBackgroundColor('#f5f5f5')
        setIsApproved(false)
    }

    const score = Math.round(employee.score);

    let badgeColor: string;
    if (score > 70) {
      badgeColor = INDICATION_COLOR.BEST;      // pastel green
    } else if (score > 40) {
      badgeColor = INDICATION_COLOR.GOOD;      // pastel yellow
    } else if (score > 20) {
      badgeColor = INDICATION_COLOR.MID;      // pastel orange
    } else {
      badgeColor = INDICATION_COLOR.BAD;      // pastel red
    }

    return (
        <Badge
            badgeContent={`${score}%`} 
            overlap="rectangular" 
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
                  backgroundColor: badgeColor,
                  boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
                }
              }} 
        > 
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
                
                    '&:hover': {
                      backgroundColor: 'rgba(88, 145, 211, 0.27)',
                      cursor: 'pointer'
                    }
                }}
                 onClick={isApproved ? removeEmployee : !isDisable ? approveEmployee : () => { }}
                >
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
                                        <Typography variant="body1">{employee.balance_points} balance points</Typography>
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


export default EmployeeDetailsCard;