import express, { Request, Response } from 'express';
import cors from 'cors';

import {languageList} from './local/languageList';
import {tabsEditors} from './local/tabs-editors';
import {workFilter} from './local/work-filter';
import {contactFilter} from './local/contact-filter';
import {me} from './local/me';


export const router = express.Router();

router.get('/languagelist', cors(), (_req: Request, res: Response) => {
    res.send(languageList);
});

router.get('/workfilter', cors(), (_req: Request, res: Response) => {
    res.send(workFilter);
});

router.get('/contactfilter', cors(), (_req: Request, res: Response) => {
    res.send(contactFilter);
});

router.get('/me', cors(), (_req: Request, res: Response) => {
    res.send(me);
});

router.get('/tabseditors', cors(), (_req: Request, res: Response) => {
    res.send(tabsEditors);
});

export default router;
