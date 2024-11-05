import orderBy from 'lodash/orderBy'
import { ElNotification } from 'element-plus'

export const roundToNearestTen = (value: number): number => {
  return Math.round(value / 10) * 10
}

export function showNotification (message: string = 'Please try again later.', title: string = 'Oops! Something went wrong.', type: 'success' | 'warning' | 'info' | 'error' = 'error') {
  ElNotification({
    title,
    message,
    type,
    showClose: true,
    offset: 50
  })
}

export function sortArrayBySortFieldAndOrder<T> (arr: T[], sortField: string, sortOrder: 'asc' | 'desc') {
  return orderBy(arr, [sortField], [`${sortOrder}`])
}
