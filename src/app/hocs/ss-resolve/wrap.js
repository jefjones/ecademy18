/**
 * addServerSideResolve(beforeServerResponse)(Component)
 *
 * HOC that attaches a static `onServer(props, store)` method to a component
 * so that ss-resolve/resolver.js can call it during SSR to pre-fetch data
 * before rendering to string.
 */
export const addServerSideResolve = (beforeServerResponse) => (WrappedComponent) => {
    const ServerResolvable = (props) => <WrappedComponent {...props} />

    ServerResolvable.onServer = function(props, store) {
        return beforeServerResponse ? beforeServerResponse(props, store) : Promise.resolve()
    }

    ServerResolvable.displayName = `ServerResolvable(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

    return ServerResolvable
}

export default addServerSideResolve
