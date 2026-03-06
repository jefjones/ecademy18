

/**
 * addServerSideResolve(beforeServerResponse)(Component)
 *
 * HOC that attaches a static `onServer(props, store)` method to a component
 * so that ss-resolve/resolver.js can call it during SSR to pre-fetch data
 * before rendering to string.
 *
 * Migration note: `createClass` was removed from React in v16. This version
 * uses an ES6 class instead and is compatible with React 16+.
 */
export const addServerSideResolve = (beforeServerResponse) => (WrappedComponent) => {
function ServerResolvable(props) {
  return <WrappedComponent {...props} />
}

    ServerResolvable.onServer = function(props, store) {
        return beforeServerResponse ? beforeServerResponse(props, store) : Promise.resolve()
    }

    ServerResolvable.displayName = `ServerResolvable(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

    return ServerResolvable
}

export default addServerSideResolve
