import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { SwapCardDetails } from './../../types/Swap'

interface SwapDetailsProps {
    employeeWithTask: SwapCardDetails
}

interface SwapRequestCardProps {
    leftDetails: SwapCardDetails;
    rightDetails: SwapCardDetails;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ employeeWithTask }) => {

    const taskDate = new Date(employeeWithTask.taskStartTime).toLocaleDateString('de-CH')
    const taskStartTime = new Date(employeeWithTask.taskStartTime).toLocaleTimeString()
    const taskEndTime = new Date(employeeWithTask.taskEndTime).toLocaleTimeString()

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PersonIcon sx={{ color: "#000", mr: 2 }} />
                <Box sx={{ justifyItems: 'start' }}>
                    <Typography sx={{ lineHeight: 1.2 }}>
                        {employeeWithTask.employeeFirstName} {employeeWithTask.employeeLastName}
                    </Typography>
                    <Typography>
                        {employeeWithTask.employeeId}
                    </Typography>
                    <Typography sx={{ fontWeight: 650 }}>
                        {taskDate}
                    </Typography>
                    <Typography sx={{ fontWeight: 650 }}>
                        {taskStartTime} - {taskEndTime}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
    leftDetails,
    rightDetails
}) => {

    const isSameTask = leftDetails.taskName === rightDetails.taskName

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                mb: 2,
                width: "48%",
                border: "1px solid rgb(229 229 229)",
                height: '129px'
            }}
        >
            {isSameTask ?
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 3
                    }}
                >
                    {leftDetails.taskName}
                </Typography> :
                <Grid
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                    }}>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 3
                        }}
                    >
                        {leftDetails.taskName}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 3
                        }}
                    >
                        {rightDetails.taskName}
                    </Typography>
                </Grid>

            }
            <Grid container alignItems="center">
                <Grid item xs={5}>
                    <SwapDetails employeeWithTask={leftDetails} />
                </Grid>

                <Grid item xs={2} sx={{ textAlign: "center", mb: '2rem' }}>
                    <CompareArrowsIcon sx={{ fontSize: 32 }} />
                </Grid>

                <Grid item xs={5}>
                    <SwapDetails employeeWithTask={rightDetails} />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SwapRequestCard;