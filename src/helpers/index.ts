import orderBy from 'lodash/orderBy'
import { ElNotification, ElMessageBox } from 'element-plus'

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

export async function showConfirmationDialog ({
  title = 'Confirmation',
  message,
  confirmButtonText = 'Yes',
  cancelButtonText = 'No',
  type = 'warning'
}: {
  title?: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
  type?: 'warning' | 'info' | 'success' | 'error'
}) {
  return ElMessageBox.confirm(
    message,
    title,
    {
      confirmButtonText,
      cancelButtonText,
      type
    }
  )
}

export function sortArrayBySortFieldAndOrder<T> (arr: T[], sortField: string, sortOrder: 'asc' | 'desc') {
  return orderBy(arr, [sortField], [`${sortOrder}`])
}

export function normalizeStringLabel (label: string) {
  return label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()
}
