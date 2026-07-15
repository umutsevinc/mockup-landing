/**
 * Landing hero placeholder screen — same warm orange gradient as the
 * plugin's default content, but the branding/device texts are replaced
 * by a single call to action: a cloud-upload icon + "Drop your content".
 * (User request: keep ONLY the background, invite the visitor to drop.)
 */

export function generateWatermarkDataURL(
  _deviceTitle: string,
  width: number = 920,
  height: number = 1920,
  orientation: 'vertical' | 'horizontal' = 'vertical'
): string {
  const w = orientation === 'horizontal' ? Math.max(width, height) : Math.min(width, height)
  const h = orientation === 'horizontal' ? Math.min(width, height) : Math.max(width, height)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // Background gradient — warm orange (identical to the plugin default)
  const grad = ctx.createLinearGradient(0, 0, w * 0.6, h)
  grad.addColorStop(0, '#FF8C00')
  grad.addColorStop(0.4, '#FF6B2B')
  grad.addColorStop(0.7, '#FF4500')
  grad.addColorStop(1, '#E83E0B')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Subtle radial glow overlay
  const radial = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, Math.max(w, h) * 0.7)
  radial.addColorStop(0, 'rgba(255, 200, 100, 0.25)')
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, w, h)

  const s = Math.min(w, h) / 920
  const cx = w / 2
  const cy = h / 2

  // ── Cloud + up arrow icon, centered ──
  const cloudW = 300 * s
  const r1 = cloudW * 0.22 // left lobe
  const r2 = cloudW * 0.3 // center lobe
  const r3 = cloudW * 0.2 // right lobe
  const baseY = cy - 20 * s

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.beginPath()
  ctx.arc(cx - cloudW * 0.28, baseY, r1, 0, Math.PI * 2)
  ctx.arc(cx + cloudW * 0.05, baseY - cloudW * 0.16, r2, 0, Math.PI * 2)
  ctx.arc(cx + cloudW * 0.32, baseY, r3, 0, Math.PI * 2)
  // Flat bottom connecting the lobes
  ctx.rect(cx - cloudW * 0.28, baseY - 2 * s, cloudW * 0.6, r1)
  ctx.fill()

  // Up arrow punched INTO the cloud (gradient-colored, reads as cutout)
  ctx.fillStyle = '#FF5A1F'
  const aw = 46 * s // arrow half width
  const ah = 70 * s // arrow head height
  const shaftW = 26 * s
  const shaftH = 60 * s
  const tipY = baseY - 55 * s
  ctx.beginPath()
  ctx.moveTo(cx, tipY)
  ctx.lineTo(cx + aw, tipY + ah)
  ctx.lineTo(cx - aw, tipY + ah)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(cx - shaftW / 2, tipY + ah - 2 * s, shaftW, shaftH)

  // ── "Drop your content" ──
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 ${Math.round(64 * s)}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`
  ctx.fillText('Drop your content', cx, cy + cloudW * 0.55)

  ctx.font = `500 ${Math.round(30 * s)}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.fillText('image or video — it plays on this screen', cx, cy + cloudW * 0.55 + 58 * s)

  return canvas.toDataURL('image/jpeg', 0.9)
}
