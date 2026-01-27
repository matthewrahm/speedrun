import { useRef, useEffect } from 'react'
import './SpeedLines.css'

function SpeedLines({ intensity = 'low' }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const linesRef = useRef([])

  const config = {
    low: { count: 15, speed: 2, opacity: 0.15 },
    medium: { count: 30, speed: 4, opacity: 0.25 },
    high: { count: 50, speed: 6, opacity: 0.35 }
  }

  const settings = config[intensity] || config.low

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize lines
    linesRef.current = Array.from({ length: settings.count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 100 + 50,
      speed: (Math.random() * 0.5 + 0.5) * settings.speed,
      opacity: Math.random() * settings.opacity
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      linesRef.current.forEach((line) => {
        // Create gradient for each line
        const gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.length)
        gradient.addColorStop(0, `rgba(74, 222, 128, 0)`)
        gradient.addColorStop(0.5, `rgba(74, 222, 128, ${line.opacity})`)
        gradient.addColorStop(1, `rgba(74, 222, 128, 0)`)

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x, line.y + line.length)
        ctx.stroke()

        // Move line down
        line.y += line.speed

        // Reset line when it goes off screen
        if (line.y > height) {
          line.y = -line.length
          line.x = Math.random() * width
          line.opacity = Math.random() * settings.opacity
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [intensity, settings.count, settings.speed, settings.opacity])

  return <canvas ref={canvasRef} className="speed-lines" />
}

export default SpeedLines
