/**
 * 显示通知
 */
export function useNotification() {
  const showNotification = (message, type = 'info') => {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.fixed.bottom-4.right-4')
    existingNotifications.forEach(notification => {
      if (notification.classList.contains('z-50')) {
        notification.remove()
      }
    })

    const notification = document.createElement('div')

    let bgColor, icon
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500'
        icon = 'fa-check-circle'
        break
      case 'warning':
        bgColor = 'bg-yellow-500'
        icon = 'fa-exclamation-triangle'
        break
      case 'error':
        bgColor = 'bg-red-500'
        icon = 'fa-times-circle'
        break
      default:
        bgColor = 'bg-primary'
        icon = 'fa-info-circle'
    }

    notification.className = `fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 z-50 flex items-center`
    notification.innerHTML = `
      <i class="fa ${icon} mr-2"></i>
      <span>${message}</span>
    `

    document.body.appendChild(notification)

    // 显示动画
    setTimeout(() => {
      notification.classList.remove('translate-y-10', 'opacity-0')
    }, 10)

    // 自动消失
    setTimeout(() => {
      notification.classList.add('translate-y-10', 'opacity-0')
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  return {
    showNotification
  }
}
