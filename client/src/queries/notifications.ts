import axiosInstance from "../axiosInstance";

export interface Notification {
  id: number;
  user_id: string;
  type: "NEW_TASK" | "SWAP_REQUEST" | "SWAP_DECISION" | "UNASSIGNED_TASK" | string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get("/notifications", {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get notifications");
  }
};

export const markNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.patch("/notifications/mark-read", {
      user_id: userId,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark notifications as read");
  }
};
