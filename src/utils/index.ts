import dayjs from 'dayjs'

export const utils = {
  countYear: (start: string, end: string | null): number => {
    const targetDate = !!end ? dayjs(end) : dayjs()
    const startDate = dayjs(start)
    return targetDate.diff(startDate, 'year')
  },
  formatDateString: (dateString: string) => {
    return dayjs(dateString).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
  }
}
