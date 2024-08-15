type Notification = {
  icon?: string
  message: string
  mode?: 'success' | 'error'
  /**
   * @default 20_000
   */
  timeout?: number
}

const notifications = ref(new Array<Notification>())

export const useNotification = () => notifications

export const notify = (notification: Notification) => {
  const { timeout = 20_000 } = notification

  notifications.value.push(notification)

  setTimeout(() => {
    const index = notifications.value.indexOf(notification)
    index !== -1 && notifications.value.splice(index, 1)
  }, timeout)
}