import 'dotenv/config';
import 'isomorphic-fetch';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import {api} from './routes';
import { createProxyMiddleware as proxy } from 'http-proxy-middleware';
import cors from 'cors';

// the reactified route-handler from the `app`
import reactHandler from '../app/_server';

// create express app...
export const app = express();



const {APP_WEB_BASE_PATH, NODE_ENV} = process.env;

// middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'self'", "https://www.google.com"],
    },
  },
}));

// Suggest HTTPS in Production
if(NODE_ENV==="production") {
    app.use(function(req: Request, res: Response, next: NextFunction) {
    	res.set('Strict-Transport-Security', `max-age=${60*5}`);
    	next();
    });
}

app.use(`${APP_WEB_BASE_PATH}/static`, express.static(path.join(__dirname, 'static'))); //But this works in local development to pick up css files. Otherwise, only app.css works and the other component css files do not work.
//app.use(express.static(path.join(__dirname, 'public')));  //The change between these two lines made the css file show up finally in production!  9/15/2022
app.use(`${APP_WEB_BASE_PATH}/api/ebi`, cors(), proxy({
    target: 'https://127.0.0.1:44348',
    //target: 'https://127.0.0.1',
    //target: 'https://ecdmy.com',
    changeOrigin: true,  //for virtual hosted sites.
    //logLevel: 'debug',
    pathRewrite: {
        '^/api/ebi': '/ebi'
    },
   //  headers: {
   // }
}));

app.use(`${APP_WEB_BASE_PATH}/api`, api);

// handle routes via react...
app.get("*", reactHandler);

// prepare 404
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    next({status: 404, message: 'Not Found'});
});

// handle any errors
app.use((err: { status?: number; message?: string; stack?: string }, req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status ?? 500).send(err.message ?? 'Application Error');
    console.error(err.status === 404 ? `404 ${req.url}` : err.stack);
});

const { PORT = '3001' } = process.env;

const server = app.listen(Number(PORT), () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Set PORT env var to use a different port.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});
