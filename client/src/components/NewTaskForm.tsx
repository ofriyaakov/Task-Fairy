import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { Star, Group } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Headline from "./Headline";
import { createTask, TaskPayload } from "../queries/task";
import { useGlobalContext } from "../contexts/GlobalContext";

interface TaskFormData {
  name: string;
  description: string;
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  gender: "Male" | "Female" | "Both";
  location: string;
  balancePoints: number;
  employeesAmount: number;
  saveToTasks: boolean;
  other: string;
}

const locations = [
  "Shishut Ramat Gan",
  "Tel Aviv Center",
  "Herzliya",
  "Jerusalem",
];

const NewTaskForm: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    description: "",
    date: dayjs(new Date()),
    startTime: dayjs(new Date()),
    endTime: dayjs(new Date()),
    gender: "Both",
    location: locations[0],
    balancePoints: 0,
    employeesAmount: 0,
    saveToTasks: false,
    other: "",
  });

  const formattedDayjs = (format: string, date: Dayjs) =>
    dayjs(date).format(format);

  const handleChange = (field: keyof TaskFormData, value: any) => {
    console.log(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TaskPayload = {
      ...formData,
      date: formattedDayjs("YYYY-MM-DD", formData.date),
      startTime: formattedDayjs("HH:mm", formData.startTime),
      endTime: formattedDayjs("HH:mm", formData.endTime),
      creatorId: connectedUser?.id || "",
    };

    try {
      const response = await createTask(payload);
      console.log("Task created:", response);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        maxWidth: 800,
        mx: "auto",
        bgcolor: "#f8fbff",
        borderRadius: 2,
        transform: "scale(0.85)", // or whatever scale you prefer
        transformOrigin: "top center",
      }}>
      <Headline color={"#e3f2fd"} title={"Create New Task"} />

      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}>
            {/* Left Column */}
            <Box>
              <TextField
                fullWidth
                label='Name'
                variant='outlined'
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
              />

              <Box sx={{ mb: 3 }}>
                <StaticDatePicker
                  orientation='portrait'
                  value={formData.date}
                  onChange={(newValue) => handleChange("date", newValue)}
                  slots={{
                    actionBar: () => null,
                    toolbar: () => null,
                  }}
                  //   slotProps={{
                  //     layout: {
                  //       sx: {
                  //         transform: "scale(0.8)", // reduce size to 80%
                  //         transformOrigin: "top center", // keep it aligned nicely
                  //       },
                  //     },
                  //   }}
                  sx={{
                    maxHeight: "300px",
                    bgcolor: "white",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>

            {/* Right Column */}
            <Box>
              <TextField
                fullWidth
                label='Description'
                variant='outlined'
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
              />

              <Typography variant='subtitle2'>Time range</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  bgcolor: "white",
                  borderRadius: 1,
                  padding: 1,
                }}>
                <Box sx={{ flex: 1 }}>
                  <TimePicker
                    label='Start Time'
                    value={formData.startTime}
                    onChange={(newValue) => handleChange("startTime", newValue)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TimePicker
                    label='End Time'
                    value={formData.endTime}
                    onChange={(newValue) => handleChange("endTime", newValue)}
                  />
                </Box>
              </Box>

              <FormControl fullWidth component='fieldset'>
                <FormLabel component='legend'>Required gender</FormLabel>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  sx={{
                    display: "flex",
                    gap: 7,
                    mb: 1,
                    bgcolor: "white",
                    borderRadius: 1,
                    padding: 1,
                  }}>
                  <FormControlLabel
                    value='Male'
                    control={<Radio size='small' />}
                    label='Male'
                  />
                  <FormControlLabel
                    value='Female'
                    control={<Radio size='small' />}
                    label='Female'
                  />
                  <FormControlLabel
                    value='Both'
                    control={<Radio size='small' />}
                    label='Both'
                  />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Location</FormLabel>
                <Select
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: "white", borderRadius: 1 }}>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}>
            <Box sx={{ mb: 1 }}>
              <FormControl fullWidth>
                <TextField
                  label='Balance points'
                  type='number'
                  value={formData.balancePoints}
                  onChange={(e) =>
                    handleChange("balancePoints", parseInt(e.target.value) || 0)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Star />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
              </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
              <FormControl fullWidth>
                <TextField
                  label='Employees amount'
                  type='number'
                  value={formData.employeesAmount}
                  onChange={(e) =>
                    handleChange(
                      "employeesAmount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Group />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
              </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
              <FormControl fullWidth>
                <TextField
                  label='Other'
                  type='text'
                  value={formData.other}
                  onChange={(e) => handleChange("other", e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
              </FormControl>
            </Box>
          </Box>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ minWidth: 150 }}>
            Create
          </Button>
        </LocalizationProvider>
      </form>
    </Paper>
  );
};

export default NewTaskForm;
