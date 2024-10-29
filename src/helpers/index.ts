import { ElNotification } from 'element-plus'

export const roundToNearestTen = (value: number): number => {
  return Math.round(value / 10) * 10
}

export function showWarningNotification (message: string, title: string = 'Error') {
  ElNotification({
    title,
    message,
    type: 'error',
    showClose: true,
    offset: 50
  })
}
