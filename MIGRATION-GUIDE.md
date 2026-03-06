# React 18 + TypeScript Migration Guide

## What has already been done (automated)

| File | Change |
|---|---|
| `package.json` | React 16 → 18, React Router v3 → v6, Webpack 1 → 5, Babel 6 → 7, `@material-ui` → `@mui` v5 + Emotion, `redux` v3 → v5, `react-redux` v5 → v9, TypeScript 4 → 5 |
| `.babelrc` | **Deleted** – replaced by `babel.config.js` |
| `babel.config.js` | New Babel 7 config (`@babel/preset-env`, `@babel/preset-react` with new JSX transform, `@babel/preset-typescript`) |
| `tsconfig.json` | Updated for React 18 (`jsx: "react-jsx"`), TypeScript 5, lenient mode (`strict: false`, `noImplicitAny: false`) to allow incremental migration |
| `webpack.base.babel.js` | Webpack 5 syntax (`rules` not `loaders`, `asset/resource`, `MiniCssExtractPlugin`, `resolve.fallback`, no HappyPack, no json-loader) |
| `webpack.client.babel.js` | Webpack 5 (`webpack serve`, `output.clean`, `splitChunks`, updated `devServer` API) |
| `webpack.server.babel.js` | Webpack 5, `libraryTarget: 'commonjs2'`, updated `nodeExternals` |
| `src/app/_client.tsx` | React 18 `createRoot` / `hydrateRoot` + `<BrowserRouter>` |
| `src/app/_server.tsx` | React 18 SSR `renderToString` + React Router v6 `<StaticRouter>` |
| `src/app/routes.tsx` | Full React Router v6 routes (`<Routes>/<Route element={<X />}>`, layout route for `EnsureLoggedIn`) |
| `src/app/store.js` | Removed `react-router-redux` (`routerReducer` import and `routing` key from `combineReducers`) |
| `src/app/containers/ensure-logged-in.js` | Renders `<Outlet />` (layout route) instead of `this.props.children`; uses `<Navigate>` instead of `browserHistory.replace` |
| `src/app/containers/app.js` | Imports `<Outlet />` and passes it as children to `<AppView>` |
| `src/app/views/AppView/AppView.js` | Wrapped with `useLocation` HOC; replaces `children.props.location.pathname` with `currentPathname` prop |
| `src/app/hocs/withRouter.tsx` | New compatibility HOC — injects `navigate`, `params`, `location`, `searchParams` into class components |
| `src/app/components/Button/Button.tsx` | Properly typed with `interface ButtonProps` (fixes the `type Props {` syntax error) |
| `src/types/index.d.ts` | Global ambient declarations (CSS modules, untyped packages, `window.__INITIAL_STATE__`) |

---

## What still needs to be done (manual / incremental)

### 1. Install new dependencies

Run after pulling this branch:

```bash
npm install
```

---

### 2. Material-UI v3 → MUI v5

Every component that imports from `@material-ui/core` or `@material-ui/icons` must be updated.

**Import changes:**
```diff
- import Button from '@material-ui/core/Button';
+ import Button from '@mui/material/Button';

- import TextField from '@material-ui/core/TextField';
+ import TextField from '@mui/material/TextField';

- import { makeStyles } from '@material-ui/core/styles';
+ import { makeStyles } from '@mui/styles'; // or use `sx` prop / `styled()`

- import SettingsIcon from '@material-ui/icons/Settings';
+ import SettingsIcon from '@mui/icons-material/Settings';
```

**Theming — wrap your app root with `ThemeProvider`:**
```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme(); // or your custom theme

<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```

**`makeStyles` migration:**
MUI v5 ships `@mui/styles` for legacy JSS support but recommends migrating to the `sx` prop or `styled()`:
```tsx
// Legacy (still works via @mui/styles):
import { makeStyles } from '@mui/styles';

// Recommended v5 pattern:
import { styled } from '@mui/material/styles';
const MyDiv = styled('div')(({ theme }) => ({ margin: theme.spacing(1) }));
```

---

### 3. Navigation — `this.props.router.push` → `useNavigate`

React Router v6 removed the `router` prop injection. Update every container that navigates programmatically.

**Option A — functional component (preferred):**
```tsx
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/home')}>Go Home</button>;
};
```

**Option B — class component using the `withRouter` HOC:**
```tsx
import withRouter from '../hocs/withRouter';

class MyPage extends Component {
  handleClick = () => this.props.navigate('/home');
  render() { ... }
}
export default withRouter(connect(mapState)(MyPage));
```

---

### 4. URL params — `this.props.params.xxx` → `useParams`

**Functional:**
```tsx
import { useParams } from 'react-router-dom';
const { courseScheduledId } = useParams<{ courseScheduledId: string }>();
```

**Class component (via withRouter HOC):**
```tsx
// this.props.params.courseScheduledId — works when wrapped with withRouter()
```

---

### 5. `react-dnd` v3 → v16 (hook-based API)

v3 used HOCs (`DragSource`, `DropTarget`); v16 uses hooks (`useDrag`, `useDrop`).

```tsx
// v16 usage
import { useDrag, useDrop } from 'react-dnd';

const [{ isDragging }, drag] = useDrag(() => ({
  type: 'CARD',
  item: { id },
  collect: (monitor) => ({ isDragging: monitor.isDragging() }),
}));
```

Wrap your root with `<DndProvider backend={HTML5Backend}>`.

---

### 6. Redux — suppress deprecation warning (optional)

`createStore` is still exported in Redux 5 but shows a deprecation notice.
To silence it, migrate to `@reduxjs/toolkit` `configureStore`:

```tsx
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({ reducer: rootReducer });
```

Or use the non-warning import:
```tsx
import { legacy_createStore as createStore } from 'redux';
```

---

### 7. JavaScript → TypeScript file by file

The build is already TypeScript-aware (`babel.config.js` includes `@babel/preset-typescript`).  
TSC type checking runs via `npm run typecheck` (non-blocking during builds).

**Rename files incrementally:**
- React components: `.js` → `.tsx`
- Pure logic (actions, reducers, utils): `.js` → `.ts`

**Tighten TypeScript over time in `tsconfig.json`:**
```json
// Start here (already set):
"strict": false, "noImplicitAny": false, "strictNullChecks": false

// Milestone 1 — enable after all files are .ts/.tsx:
"noImplicitAny": true

// Milestone 2 — enable after fixing null/undefined issues:
"strictNullChecks": true

// Milestone 3 — full strict mode:
"strict": true
```

---

### 8. Server-side `resolve` HOC

`src/app/hocs/ss-resolve` uses the React Router v3 `match()` API to walk the component tree for `static onServer()` data loaders.  
In `_server.tsx` this has been simplified to call `resolve({ location }, store)`.  
The `resolver.js` file will need updating to work without `renderProps` from v3's `match()`.

Short-term replacement approach:
- Skip SSR data preloading and let client-side `componentDidMount` calls hydrate
- Or adopt React Router v6 loaders (see [remix.run data loading docs](https://reactrouter.com/en/main/route/loader))

---

### 9. Deprecated / removed packages to address

| Package removed | Replace with |
|---|---|
| `react-router` v3 | `react-router-dom` v6 (done) |
| `react-router-redux` | Removed — use hooks (`useNavigate`, `useLocation`) |
| `material-ui` v0.20 | `@mui/material` v5 (update imports) |
| `@material-ui/core` v3 | `@mui/material` v5 |
| `@material-ui/icons` v3 | `@mui/icons-material` v5 |
| `react-addons-shallow-compare` | Built into React 16+ (`PureComponent`) |
| `react-hint` | Consider `react-tooltip` (already in deps) |
| `react-idle` | `@idlebox/react-idle-timer` or custom hook |
| `react-tooltip` v3 | Updated to v5 — API changed (use `data-tooltip-id` attr) |
| `redux-oidc` | `@axa-fr/react-oidc` or `oidc-client-ts` |

---

### 10. ESLint

Update `.eslintrc` (or create `eslint.config.js`) for ESLint 8 / React 18:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["react", "react-hooks", "@typescript-eslint"],
  "settings": {
    "react": { "version": "detect" }
  },
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

---

## Running the project

```bash
# Install all updated dependencies
npm install

# Type check (non-blocking, runs tsc --noEmit)
npm run typecheck

# Development
npm run dev

# Production build
npm run build
```
