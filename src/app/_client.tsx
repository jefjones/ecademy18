import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import AppRoutes from './routes';
import NavigationSetter from './components/NavigationSetter/NavigationSetter';
import getStore from './store';

const store = getStore();
const container = document.getElementById('app') as HTMLElement;

// Use hydrateRoot when HTML was server-side rendered, createRoot for a pure CSR shell.
// During the React 18 migration period, check for SSR content:
const hasSSRContent = container.hasChildNodes();

if (hasSSRContent) {
  hydrateRoot(
    container,
    <Provider store={store}>
      <BrowserRouter>
        <NavigationSetter />
        <AppRoutes />
      </BrowserRouter>
    </Provider>,
  );
} else {
  createRoot(container).render(
    <Provider store={store}>
      <BrowserRouter>
        <NavigationSetter />
        <AppRoutes />
      </BrowserRouter>
    </Provider>,
  );
}
