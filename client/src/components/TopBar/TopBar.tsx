import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Avatar, Typography, Box } from "@mui/material";
import {
  getNotifications,
  markNotificationsAsRead,
  Notification,
} from "../../queries/notifications";
import { useGlobalContext } from "../../contexts/GlobalContext";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge } from "@mui/material";
import Fade from "@mui/material/Fade";
import {
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { notificationTypes } from "../../consts";

export const TopBar: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!connectedUser?.id) return;

      try {
        const data = await getNotifications(connectedUser.id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotifications();
  }, [connectedUser?.id]);

  const handleNotificationClick = (notif: Notification) => {
    if (notif.type === notificationTypes.SWAP_REQUEST || notif.type === notificationTypes.SWAP_DECISION) {
      navigate("/swaps");
    } else if (notif.type === notificationTypes.NEW_TASK || notif.type === notificationTypes.UNASSIGNED_TASK) {
      navigate("/tasks");
    } else {
      console.warn("Unhandled notification type:", notif.type);
    }

    setOpen(false);
  };

  const handleBellClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);

    if (!open && connectedUser?.id) {
      try {
        await markNotificationsAsRead(connectedUser.id);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, is_read: true }))
        );
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ClickAwayListener onClickAway={handleClose}>
            <Box>
              <IconButton onClick={handleBellClick}>
                <Badge
                  badgeContent={
                    notifications.filter(
                      (notification) => !notification.is_read
                    ).length
                  }
                  color="error"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ color: "#404040" }} />
                </Badge>
              </IconButton>

              <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={200}>
                    <Paper
                      sx={{
                        width: 300,
                        maxHeight: 300,
                        overflowY: "auto",
                        p: 1,
                      }}
                    >
                      <List dense>
                        {notifications.length === 0 ? (
                          <ListItemText primary="No notifications" />
                        ) : (
                          notifications.map((notif, idx) => (
                            <ListItemButton
                              key={idx}
                              onClick={() => handleNotificationClick(notif)}
                            >
                              <ListItemText
                                primary={notif.message}
                                secondary={new Date(
                                  notif.created_at
                                ).toLocaleString()}
                              />
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
          </ClickAwayListener>

          <Avatar
            src="/path/to/avatar.jpg"
            alt={connectedUser?.name}
            sx={{ width: 35, height: 35, ml: 2 }}
          />
          <div>
            <Typography
              component="div"
              sx={{
                marginLeft: 1,
                color: "#404040",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {connectedUser?.name}
            </Typography>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
