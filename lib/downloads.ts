// tribox 桌面客户端发布物配置
// 文件名格式由 Tauri 构建器决定（aarch64.dmg / x64.dmg / x64-setup.exe / x64_en-US.msi）

export type PlatformOS = 'macOS' | 'Windows'

export interface DownloadAsset {
  os: PlatformOS
  /** i18n key under `download.assetFormats` */
  archKey: string
  format: string
  filename: (version: string) => string
}

export const DOWNLOAD_ASSETS: DownloadAsset[] = [
  {
    os: 'macOS',
    archKey: 'appleSilicon',
    format: 'DMG',
    filename: (v) => `Tribox-Next_${v}_aarch64.dmg`,
  },
  {
    os: 'macOS',
    archKey: 'intel',
    format: 'DMG',
    filename: (v) => `Tribox-Next_${v}_x64.dmg`,
  },
  {
    os: 'Windows',
    archKey: 'winInstaller',
    format: 'EXE (NSIS)',
    filename: (v) => `Tribox-Next_${v}_x64-setup.exe`,
  },
  {
    os: 'Windows',
    archKey: 'winMsi',
    format: 'MSI',
    filename: (v) => `Tribox-Next_${v}_x64_en-US.msi`,
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
    if (!ready) return { asset, url: null }
    const filename = asset.filename(version!)
    return { asset, url: `${baseUrl!.replace(/\/$/, '')}/${filename}` }
  })

  return { version, baseUrl, downloads, ready }
}
