/**
 * NavigationSetter.tsx
 *
 * A tiny component that must live inside <BrowserRouter>.
 * On mount it registers the RR v6 navigate function into the global singleton
 * (src/app/utils/navigate.ts) so that action creators and class components
 * can call navigate() without needing hooks or the withRouter HOC.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigate } from '../utils/navigate'

const NavigationSetter: React.FC = () => {
  const nav = useNavigate()
  useEffect(() => {
    setNavigate(nav)
  }, [nav])
  return null
}

export default NavigationSetter
