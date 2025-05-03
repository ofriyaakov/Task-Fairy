import { dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export type TaskOccupancy = {
  assigned: number
  total: number
}

export type TaskSummary = {
  [date: string]: [TaskOccupancy]
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