interface IconProps {
  className?: string
  size?: number
}

/**
 * macOS / Apple — 经典 Apple logo（简化路径）
 */
export function AppleIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.05 12.04c-.03-2.7 2.2-4 2.3-4.07-1.26-1.83-3.21-2.08-3.9-2.11-1.66-.17-3.24.98-4.09.98-.85 0-2.15-.95-3.54-.92-1.82.03-3.51 1.06-4.45 2.69-1.9 3.29-.48 8.15 1.36 10.83.9 1.31 1.97 2.78 3.37 2.73 1.36-.06 1.87-.88 3.51-.88s2.1.88 3.54.85c1.46-.02 2.39-1.33 3.28-2.66 1.04-1.52 1.46-3 1.49-3.07-.03-.01-2.86-1.1-2.87-4.37zM14.27 4.31c.75-.91 1.25-2.17 1.11-3.43-1.07.04-2.37.71-3.14 1.61-.7.8-1.31 2.09-1.15 3.32 1.2.09 2.43-.6 3.18-1.5z" />
    </svg>
  )
}

/**
 * Windows — 4 方格 logo
 */
export function WindowsIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 5.1L10.4 4.05V11.55H3V5.1Z" />
      <path d="M3 12.45H10.4V19.95L3 18.9V12.45Z" />
      <path d="M11.4 3.9L21 2.55V11.55H11.4V3.9Z" />
      <path d="M11.4 12.45H21V21.45L11.4 20.1V12.45Z" />
    </svg>
  )
}

/**
 * Mobile — 手机+下载组合（移动端泛指 iOS+Android）
 */
export function MobileIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

/**
 * Download arrow — 通用下载箭头
 */
export function DownloadArrow({ className = '', size = 16 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
