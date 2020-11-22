export default async function (url: string): Promise<string> {
  if (url.endsWith('.webp')) {
    return url
  }
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise<void>((resolve) => {
    image.onload = function () {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve()
    }
    image.src = url || ''
  })
  return canvas.toDataURL()
}
