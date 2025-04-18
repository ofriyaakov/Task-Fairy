import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WcIcon from '@mui/icons-material/Wc';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TaskDetailsCard as TaskDetailsCardType } from '../../types/Task';

interface TaskDetailsCardProps {
    task: TaskDetailsCardType;
}

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({ task }) => {

    return (
        <Box sx={{ p: 2, height: '15vh', width: "356px", border: "2px solid rgb(229 229 229)", borderRadius: "8px", backgroundColor: 'white' }}>
            <Grid container direction="column" alignItems="center" >
                <Grid item xs={6} md={6}>
                    <Box display={"flex"}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <WorkIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{task.name}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <LocationOnIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{task.location}</Typography>
                                </Box>
                            </Grid>


                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <AccessTimeIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{task.startTime} - {task.endTime}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <WcIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{task.gender}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={9}>
                                <Box display="flex" alignItems="center">
                                    <StarIcon sx={{ fontSize: 24, color: 'black', mr: 1 }} />
                                    <Typography variant="body1">{task.balancePoints} balance points</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}


export default TaskDetailsCard;