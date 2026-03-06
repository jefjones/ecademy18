// Re-export from the navigation singleton so existing callers of this module
// continue to work unchanged while the codebase is migrated to direct imports.
import { navigate, navigateReplace, goBack } from '../utils/navigate'

export { navigate, navigateReplace, goBack }

// Legacy compat alias used by some action creators
export const overrideAnchorClick = (e) => {
  navigate(e.target.href)
  e.preventDefault()
}

