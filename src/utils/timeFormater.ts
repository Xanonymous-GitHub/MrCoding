import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isYesterday from 'dayjs/plugin/isYesterday'
import isToday from 'dayjs/plugin/isToday'

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(customParseFormat)
dayjs.locale('zh-tw')

export default function (time?: number | undefined): string {
  const now = dayjs()
  const product = dayjs(time)
  let year: string | undefined
  const yearDistance = now.year() - product.year()
  switch (yearDistance) {
    case 0:
      year = undefined
      break
    default:
      year = product.format('YYYY/')
      break
  }
  const monthAndDay = product.isToday() ? undefined : (product.isYesterday() ? '昨天' : product.format('M/D'))
  const hourAndMinute = product.format('h:mm a')
  return [year ? (year + monthAndDay) : monthAndDay, hourAndMinute].join('\n')
}
