import { useEffect, useState, type ReactNode } from 'react'

// Local replacement for the 'react-idle' package
interface IdleProps {
  timeout?: number
  onChange?: (state: {idle: boolean}) => void
  render?: (state: {idle: boolean}) => ReactNode
  className?: string
}

export default function Idle({timeout = 60000, onChange, render}: IdleProps) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const goIdle = () => {
      setIdle(true)
      onChange?.({ idle: true })
    }

    const reset = () => {
      clearTimeout(timer)
      if (idle) {
        setIdle(false)
        onChange?.({ idle: false })
      }
      timer = setTimeout(goIdle, timeout)
    }

    timer = setTimeout(goIdle, timeout)
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    window.addEventListener('scroll', reset)
    window.addEventListener('click', reset)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('keydown', reset)
      window.removeEventListener('scroll', reset)
      window.removeEventListener('click', reset)
    }
  }, [timeout, idle, onChange])

  return render ? <>{render({ idle })}</> : null
}
