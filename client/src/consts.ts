export const dateFormate = "YYYY-MM-DD";
export const calendarFnsDateFormat = 'yyyy-MM-dd';
export const timeFormate = "HH:mm";

export const loggedUserIdKey = "loggedUserId";
export const accessTokenKey = "accessToken";
export const refreshTokenKey = "refreshToken";

export const savedTaskTitle = "Saved Tasks";
export const employeeTaskTitle = "My Tasks";

export const calendarMonthView = "month";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userLevels = {
  employee: 1,
  manager: 2,
};

export const officeTitle = "The Office";

export enum SwapRequestStatuses {
  APPROVED_NAME = 'approved',
  APPROVED_COLOR = 'rgb(233 255 239)',
  PENDING_NAME = 'pending',
  PENDING_COLOR = 'rgb(255 255 255)',
  REJECTED_NAME = 'rejected',
  REJECTED_COLOR = 'rgb(255 223 223)',
}

export const notificationTypes = {
  SWAP_REQUEST: 'SWAP_REQUEST',
  SWAP_DECISION: 'SWAP_DECISION',
  NEW_TASK: 'NEW_TASK',
  UNASSIGNED_TASK: 'UNASSIGNED_TASK',
}