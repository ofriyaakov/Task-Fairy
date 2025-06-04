import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import WcIcon from '@mui/icons-material/Wc';
import BusinessIcon from '@mui/icons-material/Business';
import { INDICATION_COLOR, APP_COLOR } from '../../theme';
import { employeeDatailsCard } from '../../types/employee';

type Mode = 'suggestion' | 'swap';

interface EmployeeCardProps {
  employee: employeeDatailsCard;
  mode: Mode;
  isDisabled: boolean;
  handleApproveEmployee?: (employeeId: string) => void;
  handleRemoveEmployee?: (employeeId: string) => void;
  createSwapRequest?: (userId: string) => void;
}

const EmployeeDetailsCard: React.FC<EmployeeCardProps> = ({
  employee,
  mode,
  isDisabled,
  handleApproveEmployee,
  handleRemoveEmployee,
  createSwapRequest
}) => {
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [cardBackgroundColor, setCardBackgroundColor] = useState<string>('#f5f5f5');

  const handleClick = () => {
    if (mode === 'suggestion') {
      if (isApproved) {
        handleRemoveEmployee?.(employee.user_id);
        setIsApproved(false);
        setCardBackgroundColor('#f5f5f5');
      } else if (!isDisabled) {
        handleApproveEmployee?.(employee.user_id);
        setIsApproved(true);
        setCardBackgroundColor('#e1f4ff');
      }
    } else if (mode === 'swap') {
      if (!isDisabled) {
        createSwapRequest?.(employee.user_id);
      }
    }
  };

  const score = Math.round(employee.score || 0);
  const badgeColor =
    score > 70 ? INDICATION_COLOR.BEST :
    score > 40 ? INDICATION_COLOR.GOOD :
    score > 20 ? INDICATION_COLOR.MID :
    INDICATION_COLOR.BAD;

  const badgeContent = mode === 'suggestion'
    ? `${score}%`
    : 'Request Swap';

  const badgeStyles = mode === 'suggestion'
    ? {
        color: 'black',
        backgroundColor: badgeColor,
      }
    : {
        color: isDisabled ? APP_COLOR.BLACK : APP_COLOR.WHITE,
        backgroundColor: isDisabled ? APP_COLOR.PLATINUM_GREY : APP_COLOR.CERULEAN_BLUE,
        '&:hover': {
          backgroundColor: isDisabled ? APP_COLOR.PLATINUM_GREY : '#7B9DB9',
          cursor: 'pointer'
        }
      };

  return (
    <Badge
      badgeContent={badgeContent}
      overlap="rectangular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClick={mode === 'swap' ? handleClick : () => null}
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
          padding: mode === 'swap' ? '10px 10px' : '0 6px',
          boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)',
          ...badgeStyles
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
          ...(mode === 'suggestion' && {
            '&:hover': {
              backgroundColor: 'rgba(88, 145, 211, 0.27)',
              cursor: 'pointer'
            }
          })
        }}
        onClick={mode === 'suggestion' ? handleClick : () => null}
      >
        <Grid container direction="column" alignItems="center">
          <Grid item xs={6} md={6}>
            <Box display="flex">
              <Grid container>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                    <Typography variant="body1">
                      {employee.first_name} {employee.last_name}, {mode === 'suggestion' ? employee.group_name : employee.user_id}
                    </Typography>
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

                {mode === 'swap' && (
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                      <Typography variant="body1">{employee.group_name}, {employee.company_name}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Badge>
  );
};

export default EmployeeDetailsCard;
