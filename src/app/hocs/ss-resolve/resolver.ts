/**
 * resolve(props, store)
 *
 * React Router v6 migration notes:
 *
 *   In v3, `props.components` was provided by `match()` — an array of all the
 *   route-level components matched for the current URL. In v6 there is no
 *   equivalent synchronous API when using JSX routes.
 *
 *   Option A (current, simple): pass a `routeConfig` array exported from
 *   routes.tsx together with the current `location` so that `matchRoutes` can
 *   discover matched components and call their `onServer` statics.
 *
 *   Option B (no-op, incremental): if no routeConfig is provided the resolver
 *   returns an immediately-resolved Promise and all data fetching is deferred
 *   to the client via componentDidMount / useEffect. This was also the
 *   effective behaviour in v3 when no component had an `onServer` static.
 *
 * Usage from _server.tsx:
 *   import { resolve } from './hocs/ss-resolve'
 *   // Option A:
 *   import { routeConfig } from './routes'
 *   resolve({ location: req.url, routeConfig }, store).then(...)
 *   // Option B (current):
 *   resolve({ location: req.url }, store).then(...)
 */
import { matchRoutes } from 'react-router-dom'

export default function resolve(props, store) {
    // ── Option A: route-config array provided ──────────────────────────────
    if (props.routeConfig && props.location) {
        const matched = matchRoutes(props.routeConfig, props.location) || []
        const promises = matched
            .map(({ route }) => route.element?.type || null)
            // unwrap react-redux connected components
            .map(component => component && (component.WrappedComponent || component))
            .filter(component => component && component.onServer)
            .map(component => component.onServer(props, store))
        return Promise.all(promises)
    }

    // ── Option B: legacy { components } shape (RR v3) ─────────────────────
    if (props.components) {
        const promises = (props.components || [])
            .map(component => component.WrappedComponent || component)
            .filter(component => component.onServer)
            .map(component => component.onServer(props, store))
        return Promise.all(promises)
    }

    // ── Option C: no route info — resolve immediately (client loads data) ──
    return Promise.resolve()
}
