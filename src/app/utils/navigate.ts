/**
 * navigate.ts — global navigation singleton for React Router v6
 *
 * This replaces the React Router v3 `browserHistory` singleton pattern.
 * Call setNavigate() once at startup (via <NavigationSetter> inside BrowserRouter),
 * then call navigate() / navigateReplace() / goBack() from anywhere —
 * including Redux action creators and class-based component methods —
 * without needing hooks or the withRouter HOC.
 *
 * Usage in any file:
 *   import { navigate, navigateReplace, goBack } from '../utils/navigate'
 *   navigate('/myProfile')
 *   navigateReplace('/login')
 *   goBack()
 */

import type { NavigateFunction } from 'react-router-dom'

let _navigate: NavigateFunction | null = null

/** Called once by <NavigationSetter> which lives inside <BrowserRouter>. */
export function setNavigate(fn: NavigateFunction): void {
  _navigate = fn
}

/**
 * Navigate to a path.
 * Falls back to window.location for server/pre-hydration environments.
 */
export function navigate(to: string, options?: { replace?: boolean; state?: unknown }): void {
  if (_navigate) {
    _navigate(to, options)
  } else {
    window.location.href = to
  }
}

/**
 * Navigate replacing the current history entry (no back-stack entry added).
 * Equivalent to the old `browserHistory.replace(path)`.
 */
export function navigateReplace(to: string): void {
  navigate(to, { replace: true })
}

/**
 * Go one step back in the history stack.
 * Equivalent to the old `browserHistory.goBack()`.
 */
export function goBack(): void {
  if (_navigate) {
    _navigate(-1)
  } else {
    window.history.back()
  }
}
