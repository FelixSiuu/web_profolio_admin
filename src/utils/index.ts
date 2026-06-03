import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const utils = {
  countYear: (start: string, end: string | null): number => {
    const targetDate = !!end ? dayjs(end) : dayjs()
    const startDate = dayjs(start)
    return targetDate.diff(startDate, 'year')
  },
  formatDateString: (dateString: string) => {
    return dayjs.utc(dateString).local().format('YYYY-MM-DD HH:mm:ss')
  }
}
