export default function (time?: number | undefined): string {
  const clientTime = new Date(time || Date.now())
  const isAm = clientTime.getHours() < 12
  const hour = clientTime.getHours()
  let minute: (number | string) = clientTime.getMinutes()
  if (minute < 10) {
    minute = '0' + minute.toString()
  } else {
    minute = minute.toString()
  }
  return (isAm ? hour : hour - 12) + ':' + minute.toString() + (isAm ? ' am' : ' pm')
}
