export function formatBytes(bytes, decimals = 2, txt = false) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  // let s = sizes[i % sizes.]
  let s = txt ? sizes[i] : ''

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + s //+ ' ' + sizes[i]
}
