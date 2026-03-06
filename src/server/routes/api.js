import express from 'express';
import cors from 'cors';

import {languageList} from './local/languageList.js';
import {tabsEditors} from './local/tabs-editors.js';
import {workFilter} from './local/work-filter.js';
import {contactFilter} from './local/contact-filter.js';
import {me} from './local/me.js';


export const router = express.Router();

router.get('/languagelist', cors(), (req, res) => {
    res.send(languageList);
});

router.get('/workfilter', cors(), (req, res) => {
    res.send(workFilter);
});

router.get('/contactfilter', cors(), (req, res) => {
    res.send(contactFilter);
});

router.get('/me', cors(), (req, res) => {
    res.send(me);
});

router.get('/tabseditors', cors(), (req, res) => {
    res.send(tabsEditors);
});

export default router;
