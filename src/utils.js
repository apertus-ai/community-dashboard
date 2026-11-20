// Small formatting helpers shared across panels.

const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCompact(value) {
  if (value == null) return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return compactFormatter.format(n)
}

export function formatDuration(ms) {
  const n = Number(ms)
  if (!Number.isFinite(n)) return '—'
  const minutes = Math.round(n / 60000)
  if (minutes < 1) return '<1m'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.round(days / 30)
  if (months < 18) return `${months}mo`
  return `${Math.round(months / 12)}y`
}

// Clipboard write with an execCommand fallback for non-secure contexts.
// Returns true only if the copy actually succeeded.
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      textarea.remove()
      return ok
    } catch {
      return false
    }
  }
}

export function timeAgo(dateString) {
  if (!dateString) return '—'
  const then = new Date(dateString).getTime()
  if (!Number.isFinite(then)) return '—'
  const seconds = Math.max(0, (Date.now() - then) / 1000)
  if (seconds < 60) return `${Math.round(seconds)}s ago`
  const minutes = seconds / 60
  if (minutes < 60) return `${Math.round(minutes)}m ago`
  const hours = minutes / 60
  if (hours < 24) return `${Math.round(hours)}h ago`
  const days = hours / 24
  if (days < 30) return `${Math.round(days)}d ago`
  const months = days / 30
  if (months < 12) return `${Math.round(months)}mo ago`
  return `${Math.round(months / 12)}y ago`
}
