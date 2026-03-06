import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { Request, Response, NextFunction } from 'express';
import { minify } from 'html-minifier';

import docTemplate from './HTML';
import AppRoutes from './routes';
import getStore from './store';
import { resolve } from './hocs/ss-resolve';
import { selectHTTPResponseCode } from './store';
import * as env from './env';

export default (req: Request, res: Response, next: NextFunction): void => {
  const store = getStore();

  // resolve walks the matched route tree and calls static onServer() data loaders
  resolve({ location: req.url }, store)
    .then(() => {
      const initialState = store.getState();
      const httpStatus: number = selectHTTPResponseCode(initialState) ?? 200;

      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url}>
            <AppRoutes />
          </StaticRouter>
        </Provider>,
      );

      const helmetData = Helmet.rewind();

      res.status(httpStatus).send(
        minify(
          docTemplate({
            ...(helmetData as any),
            content,
            initialState,
            env,
            base_path: (env as any).APP_WEB_BASE_PATH,
          }),
          { collapseWhitespace: true, removeAttributeQuotes: true },
        ),
      );
    })
    .catch(next);
};
