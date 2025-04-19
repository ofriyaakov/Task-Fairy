import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
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
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                mb: 2,
                maxWidth: '340px',
                border: '1px solid rgb(229 229 229)',
                height: '130px'
            }}
        >
            <Grid container >
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {task.name}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                            {task.location}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                            {task.startTime} - {task.endTime}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WcIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                            Only males
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                            {task.balancePoints} Balance points
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}


export default TaskDetailsCard;