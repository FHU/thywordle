import { isToday, startOfToday, startOfYesterday } from 'date-fns'

export const getToday = () => startOfToday()
export const getYesterday = () => startOfYesterday()

export const hasPlayedToday = (date: Date) => isToday(date)
