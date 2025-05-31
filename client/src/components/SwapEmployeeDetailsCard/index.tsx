import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import WcIcon from '@mui/icons-material/Wc';
import BusinessIcon from '@mui/icons-material/Business';
import { employeeDatailsCard } from '../../types/employee';
import { APP_COLOR } from '../../theme';

interface SwapEmployeeDetailsCardProps {
    employee: employeeDatailsCard;
    isSwapDisabled: boolean;
    createSwapRequest: (userId: string) => void;
}

const SwapEmployeeDetailsCard: React.FC<SwapEmployeeDetailsCardProps> = ({
    employee,
    isSwapDisabled,
    createSwapRequest,
}) => {

    return (
        <Badge
            badgeContent="Request Swap" 
            overlap="rectangular" 
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClick={() => !isSwapDisabled && createSwapRequest(employee.user_id)}
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
                  padding: "10px 10px",
                  color: isSwapDisabled ? APP_COLOR.BLACK : APP_COLOR.WHITE,
                  backgroundColor: isSwapDisabled ? APP_COLOR.PLATINUM_GREY : APP_COLOR.CERULEAN_BLUE,
                  boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",

                  '&:hover': {
                    backgroundColor: isSwapDisabled ? APP_COLOR.PLATINUM_GREY :'#7B9DB9',
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
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Grid container direction="column" alignItems="center" >
                    <Grid item xs={6} md={6}>
                        <Box display={"flex"}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center">
                                        <PersonIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                        <Typography variant="body1">{employee.first_name} {employee.last_name}, {employee.user_id}</Typography>
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
                                <Grid item xs={9}>
                                    <Box display="flex" alignItems="center">
                                        <BusinessIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                        <Typography variant="body1">{employee.group_name}, {employee.company_name}</Typography>
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