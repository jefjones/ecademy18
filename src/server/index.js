import 'dotenv/config';
import 'isomorphic-fetch';
import express from 'express';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import {api} from './routes';
import proxy from 'http-proxy-middleware';
import cors from 'cors';

// the reactified route-handler from the `app`
import reactHandler from '../app/_server.js';

// create express app...
export const app = express();



const {APP_WEB_BASE_PATH, NODE_ENV} = process.env;

// middleware
app.use(compression());
app.use(helmet());

// Suggest HTTPS in Production
if(NODE_ENV==="production") {
    app.use(function(req, res, next) {
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
app.use("*", (req, res, next) => { // eslint-disable-line
    next({status: 404, message: "Not Found"});
});

// handle any errors
app.use( (err, req, res, next) => { // eslint-disable-line
    res.status(err.status||500).send(err.message || "Application Error");
    console.error(err.status===404?`404 ${req.url}`: err.stack); // eslint-disable-line
});

const { PORT } = process.env;

app.listen(3001); // eslint-disable-line
