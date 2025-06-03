import { dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export type TaskOccupancy = {
  assigned?: number
  total?: number
  isAssignedToCurrentUser: boolean
}

export type TaskSummary = {
  [date: string]: [TaskOccupancy]
}

export const enum CalendarPages {
  MANAGER = 'manager',
  PROFILE = 'employee',
  SWAP = 'swap',
}

const locales = {
  'en-US': enUS,
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})