// tribox 桌面客户端发布物配置
// 文件名格式由 Tauri 构建器决定（aarch64.dmg / x64.dmg / x64-setup.exe / x64_en-US.msi）

export interface DownloadAsset {
  os: 'macOS' | 'Windows' | 'Linux'
  arch: string
  icon: string
  format: string
  filename: (version: string) => string
  /** 若返回 null 表示该平台尚未支持，UI 应展示为 "开发中" */
  available: boolean
}

export const DOWNLOAD_ASSETS: DownloadAsset[] = [
  {
    os: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    icon: '🍎',
    format: 'DMG',
    filename: (v) => `Tribox-Next_${v}_aarch64.dmg`,
    available: true,
  },
  {
    os: 'macOS',
    arch: 'Intel x86_64',
    icon: '🍎',
    format: 'DMG',
    filename: (v) => `Tribox-Next_${v}_x64.dmg`,
    available: true,
  },
  {
    os: 'Windows',
    arch: 'x64 — 安装程序',
    icon: '🪟',
    format: 'EXE (NSIS)',
    filename: (v) => `Tribox-Next_${v}_x64-setup.exe`,
    available: true,
  },
  {
    os: 'Windows',
    arch: 'x64 — MSI 部署包',
    icon: '🪟',
    format: 'MSI',
    filename: (v) => `Tribox-Next_${v}_x64_en-US.msi`,
    available: true,
  },
  {
    os: 'Linux',
    arch: 'AppImage / deb',
    icon: '🐧',
    format: 'AppImage / deb',
    filename: () => '',
    available: false,
  },
]

export interface ResolvedDownload {
  asset: DownloadAsset
  /** 完整下载 URL；未配置 release 时为 null */
  url: string | null
}

export function resolveDownloads(): {
  version: string | null
  baseUrl: string | null
  downloads: ResolvedDownload[]
  ready: boolean
} {
  const version = process.env.NEXT_PUBLIC_RELEASE_VERSION || null
  const baseUrl = process.env.NEXT_PUBLIC_RELEASE_BASE_URL || null
  const ready = !!(version && baseUrl)

  const downloads: ResolvedDownload[] = DOWNLOAD_ASSETS.map((asset) => {
    if (!asset.available || !ready) {
      return { asset, url: null }
    }
    const filename = asset.filename(version!)
    return { asset, url: `${baseUrl!.replace(/\/$/, '')}/${filename}` }
  })

  return { version, baseUrl, downloads, ready }
}
