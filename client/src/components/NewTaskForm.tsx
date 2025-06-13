import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { Star, Group, AutoAwesome } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Headline from "./Headline";
import { TaskDetails, TaskPayload, TaskForAi } from "./../types/Task";
import { analyzeTask, createTask } from "../queries/task";
import { useGlobalContext } from "../contexts/GlobalContext";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { State, City } from "country-state-city";
import { officeTitle } from "../consts";
import { Check } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { APP_COLOR } from "../theme";

interface NewTaskFormProps {
  initialData?: TaskDetails | null;
}

const districts = State.getStatesOfCountry("IL");
const israelCities = districts.flatMap((district) => {
  return City.getCitiesOfState("IL", district.isoCode);
});

const locations = [officeTitle, ...israelCities.map((city) => city.name)];

const NewTaskForm: React.FC<NewTaskFormProps> = ({ initialData }) => {
  const { connectedUser } = useGlobalContext();
  const [loadingAI, setLoadingAI] = useState(false);
  const [clickedAI, setClickedAI] = useState(false);

  const [formData, setFormData] = useState<TaskDetails>(
    initialData || {
      name: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      gender: "Both",
      location: locations[0],
      balancePoints: 0,
      employeesAmount: 0,
      saveToTasks: false,
      other: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleDateChange = (selectedDate: Date) => {
    setFormData((prev) => {
      const newStart = dayjs(selectedDate)
        .hour(dayjs(prev.startTime).hour())
        .minute(dayjs(prev.startTime).minute())
        .toDate();

      const newEnd = dayjs(selectedDate)
        .hour(dayjs(prev.endTime).hour())
        .minute(dayjs(prev.endTime).minute())
        .toDate();

      return {
        ...prev,
        startTime: newStart,
        endTime: newEnd,
      };
    });
  };

  const handleChange = (field: keyof TaskDetails, value: any) => {
    if (field === "name" || field === "description") {
      setClickedAI(false);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TaskPayload = {
      ...formData,
      companyId: connectedUser?.companyId || 0,
    };

    try {
      await createTask(payload);
      toast.success("Task created successfully!");
    } catch (err: any) {
      toast.error("Failed to create task.");
      console.error(err.message);
    }
  };

  const handleTaskAnalyze = async () => {
    setLoadingAI(true);
    setClickedAI(true);
    const payload: TaskForAi = {
      name: formData.name,
      description: formData.description,
      companyId: connectedUser?.companyId || 0,
    };

    try {
      const response = await analyzeTask(payload);
      formData.balancePoints = response;
      setFormData((prev) => ({ ...prev, balancePoints: response }));
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! Something went wrong");
    }
    setLoadingAI(false);
  };

  const isFormValid = () => {
    const {
      name,
      description,
      startTime,
      endTime,
      balancePoints,
      employeesAmount,
    } = formData;
    return (
      name.trim() !== "" &&
      description.trim() !== "" &&
      startTime !== null &&
      endTime !== null &&
      balancePoints > 0 &&
      employeesAmount > 0
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: "0 8px 8px 8px",
        mx: "auto",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        height: { xs: "auto", sm: "auto", md: "86vh" },
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Headline color={"#e3f2fd"} title={"Create New Task"} />
      <Box
        sx={{
          p: 2,
          mx: "auto",
          bgcolor: APP_COLOR.OFF_WHITE,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 4,
              }}
            >
              {/* Left Column */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  ml: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                    marginBottom: 3,
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                  }}
                />

                <FormControl fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{
                      display: "flex",
                      mt: 4,
                      transform: "scale(0.7)",
                      transformOrigin: "bottom left",
                      width: "100%",
                    }}
                  >
                    Location
                  </FormLabel>
                  <Select
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      transform: "scale(0.9)",
                      transformOrigin: "top center",
                      textAlign: "left",
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                      MenuListProps: {
                        dense: true,
                      },
                    }}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <FormControl fullWidth component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel
                      component="legend"
                      sx={{
                        display: "flex",
                        transform: "scale(0.7)",
                        transformOrigin: "bottom left",
                        width: "100%",
                      }}
                    >
                      Required gender
                    </FormLabel>

                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      sx={{
                        display: "flex",
                        gap: 5,
                        // bgcolor: "white",
                        borderRadius: 1,
                        // padding: 1,

                        justifyContent: "space-between",
                      }}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio size="small" />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio size="small" />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio size="small" />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    maxWidth: "100%",
                    display: "flex",
                    marginTop: 4,
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      label="Employees amount"
                      type="number"
                      value={formData.employeesAmount}
                      onChange={(e) =>
                        handleChange(
                          "employeesAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      inputProps={{ min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Group />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ bgcolor: "white", borderRadius: 1, marginRight: 3 }}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Balance points"
                      type="number"
                      value={loadingAI ? "" : formData.balancePoints}
                      onChange={(e) =>
                        handleChange(
                          "balancePoints",
                          parseInt(e.target.value) || 0
                        )
                      }
                      inputProps={{ min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Star />
                          </InputAdornment>
                        ),
                        endAdornment: loadingAI ? (
                          <InputAdornment position="start" sx={{ ml: -10 }}>
                            <Box>
                              <BeatLoader color="#1976d2" />
                            </Box>
                          </InputAdornment>
                        ) : null,
                        readOnly: loadingAI,
                      }}
                      sx={{ bgcolor: "white", borderRadius: 1 }}
                    />
                  </FormControl>

                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      maxWidth: "30%",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title="AI Balance Points" arrow placement="top">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          ml: 1,
                          borderRadius: 4,
                          minWidth: 55,
                          height: 55,
                          borderWidth: 2,
                          bg: "white",
                        }}
                        onClick={() => handleTaskAnalyze()}
                        disabled={
                          !formData.name || !formData.description || clickedAI
                        }
                      >
                        <AutoAwesome fontSize="medium" />
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Right Column */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <StaticDatePicker
                    orientation="portrait"
                    value={dayjs(formData.startTime)}
                    onChange={(newValue) =>
                      newValue && handleDateChange(newValue.toDate())
                    }
                    slots={{
                      actionBar: () => null,
                      toolbar: () => null,
                    }}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 2,
                      transform: "scale(1.15)",
                      transformOrigin: "top center",
                      maxHeight: "300px !important",
                      height: "300px",
                      maxWidth: "350px",
                      marginX: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                      paddingLeft: 2,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    borderRadius: 1,
                    padding: 1,
                    marginTop: 4,
                    width: "80%",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <TimePicker
                      label="Start Time"
                      value={dayjs(formData.startTime)}
                      onChange={(newValue) =>
                        handleChange("startTime", newValue?.toDate())
                      }
                      sx={{ bgcolor: "white" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <TimePicker
                      label="End Time"
                      value={dayjs(formData.endTime)}
                      onChange={(newValue) =>
                        handleChange("endTime", newValue?.toDate())
                      }
                      minTime={dayjs(formData.startTime)} 
                      sx={{ bgcolor: "white" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* bottom Column */}

            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                mt: 4,
                mb: 2,
                mx: 2,
              }}
            >
              <FormControl sx={{ width: "50%" }}>
                <TextField
                  label="Comment"
                  type="text"
                  value={formData.other}
                  onChange={(e) => handleChange("other", e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 1, marginRight: 4 }}
                />
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.saveToTasks}
                      onChange={(e) =>
                        handleChange("saveToTasks", e.target.checked)
                      }
                    />
                  }
                  label="Add to saved tasks"
                />

                <IconButton
                  type="submit"
                  disabled={!isFormValid()}
                  sx={{
                    bgcolor: "#93E2C5",
                    color: "white",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    "&:hover": {
                      bgcolor: "#78DBB7",
                    },
                  }}
                >
                  <Check sx={{ fontSize: 60 }} />
                </IconButton>
              </Box>
            </Box>
          </LocalizationProvider>
        </form>
      </Box>
    </Paper>
  );
};

export default NewTaskForm;
