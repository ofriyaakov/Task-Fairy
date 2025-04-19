
import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Paper,
    Stack,
} from '@mui/material';
import { TaskDetailsCard as TaskDetailsCardType } from '../../types/Task';
import TaskDetailsCard from './../TaskDetailsCard';
import Headline from './../Headline';
import { getAllSavedTasks } from './../../queries/task';

const SavedTasks: React.FC = () => {
    const [savedTasks, setSavedTasks] = useState<TaskDetailsCardType[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchSavedTasks = async () => {
        try {
            const fetchedSavedTasks: TaskDetailsCardType[] = await getAllSavedTasks()
            setSavedTasks(fetchedSavedTasks)
        } catch (err: any) {
            console.error(err.message);
            setSavedTasks([])
        }
    }

    useEffect(() => {
        fetchSavedTasks();
    }, []);

    const filteredTasks = savedTasks.filter((task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                width: '100%',
                maxWidth: '388px',
                overflow: 'hidden',
            }}>
            <Box sx={{ mt: '8px' }}>
                <Headline color='rgb(206, 244, 255)' title='Saved tasks' />
            </Box>

            <Box sx={{
                px: 2,
                pb: 2,
                bgcolor: 'rgb(250 250 250)',
                height: '650px'
            }}>
                <TextField
                    placeholder="search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        sx: {
                            borderRadius: 2,
                            mb: 2,
                            width: '356px',
                            mt: 2
                        }
                    }}
                />

                <Stack spacing={2} sx={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '592px' }}>
                    {filteredTasks.map((task, index) => (
                        <TaskDetailsCard key={index} task={task} />
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
}

export default SavedTasks