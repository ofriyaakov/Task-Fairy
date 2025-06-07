import React, { useState } from "react";
import { Grid, Box, Typography, IconButton, Badge } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import WcIcon from "@mui/icons-material/Wc";
import BusinessIcon from '@mui/icons-material/Business';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { employeeDatailsCard } from "../../types/employee";
import { INDICATION_COLOR, APP_COLOR } from "../../theme";

type Mode = 'suggestion' | 'swap';

interface EmployeeDetailsCardProps {
  employee: employeeDatailsCard;
  handleApproveEmployee?: (employeeId: employeeDatailsCard) => void;
  handleRemoveEmployee?: (employeeId: employeeDatailsCard) => void;
  createSwapRequest?: (userId: string) => void;
  mode: Mode;
  isDisable: boolean;
  isSuggestion?: boolean;
  isAssigned?: boolean;
  disableAdd?: boolean;
}

const EmployeeDetailsCard: React.FC<EmployeeDetailsCardProps> = ({
  employee,
  handleApproveEmployee,
  handleRemoveEmployee,
  mode,
  createSwapRequest,
  isDisable,
  isSuggestion = true,
  isAssigned = false,
  disableAdd = false,
}) => {

  const handleSwapClick = () => {
    if (!isDisable) {
        createSwapRequest?.(employee.user_id);
    }
  };

  const approveEmployee = () => {
    if (disableAdd) return; // Prevent action if disabled
    handleApproveEmployee?.(employee);
  };

  const removeEmployee = () => {
    handleRemoveEmployee?.(employee);
  };

  const score = Math.round(employee.score);
  let badgeColor: string;
  if (score > 70) {
      badgeColor = INDICATION_COLOR.BEST;      // pastel green
  } else if (score > 40) {
      badgeColor = INDICATION_COLOR.GOOD;      // pastel yellow
  } else if (score > 20) {
      badgeColor = INDICATION_COLOR.MID;      // pastel orange
  } else {
    badgeColor = INDICATION_COLOR.BAD; // pastel red
  }

    const cardBox = (
        <Box
          sx={{
            p: 2,
            height: "15vh",
            width: "356px",
            border: "2px solid rgb(229 229 229)",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.2s ease-in-out",
            position: "relative", // to position the button inside
          }}
        >
          <Grid container direction="column" alignItems="center">
            <Grid item xs={6} md={6}>
              <Box display="flex">
                <Grid container>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ fontSize: 24, color: "black", mr: 1 }} />
                      <Typography variant="body1">
                        {employee.first_name} {employee.last_name}, {mode === 'swap' ? employee.user_id : employee.group_name}
                      </Typography>
                    </Box>
                  </Grid>
    
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <HomeIcon sx={{ fontSize: 24, color: "black", mr: 1 }} />
                      <Typography variant="body1">{employee.city}</Typography>
                    </Box>
                  </Grid>
    
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <StarIcon sx={{ fontSize: 24, color: "black", mr: 1 }} />
                      <Typography variant="body1">
                        {employee.balance_points} balance points
                      </Typography>
                    </Box>
                  </Grid>
    
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <WcIcon sx={{ fontSize: 24, color: "black", mr: 1 }} />
                      <Typography variant="body1">{employee.gender}</Typography>
                    </Box>
                  </Grid>

                  {mode === 'swap' && (
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                      <Typography variant="body1">{employee.group_name}</Typography>
                    </Box>
                  </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
    
          {/* Action Button */}
          {mode !== "swap" && (isSuggestion || isAssigned) && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                isSuggestion ? approveEmployee() : isAssigned && removeEmployee();
              }}
              disabled={disableAdd}
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              {isSuggestion ? (
                <CheckIcon sx={{ color: "green" }} />
              ) : (
                <CloseIcon sx={{ color: "red" }} />
              )}
            </IconButton>
          )}
        </Box>
      );
    
    return mode === 'swap' ? (
        <Badge
            badgeContent='Request Swap'
            overlap="rectangular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClick={handleSwapClick}
            sx={{
                display: 'inline-block',
                '& .MuiBadge-badge': {
                right: 12,
                top: 12,
                transform: 'scale(1.5)',
                transformOrigin: '100% 0%',
                fontSize: '0.75rem',
                minWidth: '24px',
                height: '24px',
                borderRadius: '12px',
                padding: '10px 10px',
                boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)',
                color: isDisable ? APP_COLOR.BLACK : APP_COLOR.WHITE,
                backgroundColor: isDisable ? APP_COLOR.PLATINUM_GREY : APP_COLOR.CERULEAN_BLUE,
                    '&:hover': {
                        backgroundColor: isDisable ? APP_COLOR.PLATINUM_GREY : '#7B9DB9',
                        cursor: 'pointer'
                    }
                }
            }}
        >
            {cardBox}  
        </Badge>
      ) : isSuggestion ? (
        <Badge
          badgeContent={score && score > 0 ? `${score}%` : "Not suggested"}
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
            },
          }}
        >
          {cardBox}
        </Badge>
      ) : 
      (
        cardBox
      );
};

export default EmployeeDetailsCard;
