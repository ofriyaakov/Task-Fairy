import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Typography, Divider } from "@mui/material";
import "./Navbar.css";
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskIcon from "@mui/icons-material/Task";
import GroupIcon from "@mui/icons-material/Group";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGlobalContext } from "../../contexts/GlobalContext";

const drawerWidth = 17;

interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path?: string;
    onClick?(): void;
}

export const Navbar: FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const navigate = useNavigate();
    const { setConnectedUser } = useGlobalContext() 

    const mainMenuItems: MenuItem[] = [
        { text: "Dashboard", icon: <BarChartIcon />, path: "/dashboard" },
        { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
        { text: "Tasks", icon: <TaskIcon />, path: "/tasks" },
        { text: "Employees", icon: <GroupIcon />, path: "/employees" },
        { text: "Swaps", icon: <SwapHorizIcon />, path: "/manager-swaps" },
    ];
    
    const bottomMenuItems: MenuItem[] = [
        { text: "Logout", icon: <LogoutIcon />, path: "/login", onClick: () => setConnectedUser(null) },
    ];    

    const handleListItemClick = (index: number, path?: string, onClick?: Function) => {
        setSelectedIndex(index);
        if (path) {
            navigate(path);
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: `${drawerWidth}%`,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: `${drawerWidth}%`,
                    boxSizing: "border-box",
                    borderRight: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 80,
                    padding: "16px 16px 0 16px",
                }}
            >
                <img src="/TaskFairyLogo.png" alt="App Logo" className="NavbarLogo" />
            </Box>

            <List>
                {mainMenuItems.map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => handleListItemClick(index, item.path)}
                            selected={selectedIndex === index}
                            sx={{
                                py: 0,
                                backgroundColor: 'transparent',
                                position: 'relative',
                                pl: 2,
                                '&.Mui-selected::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 5,
                                    backgroundColor: '#87B7FF',
                                    borderRadius: '0px 8px 8px 0px',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'transparent',
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'transparent',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    pl: 2,
                                    fontSize: "10px",
                                    backgroundColor:
                                        selectedIndex === index ? "#87B7FF" : "transparent",
                                    py: 1,
                                    borderRadius: 2,
                                }}
                            >
                                <ListItemIcon sx={{ color: "#000000" }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ marginTop: "auto" }}>
                <Divider />
                <List>
                    {bottomMenuItems.map((item, index) => {
                        const bottomIndex = mainMenuItems.length + index;
                        return (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleListItemClick(bottomIndex, item.path, item.onClick)}
                                    selected={selectedIndex === bottomIndex}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        "&.Mui-selected": {
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "#000000" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
};
