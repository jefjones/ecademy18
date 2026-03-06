import NodeMediaServer from 'node-media-server';
import defaultConfig from './config/default';

const config = defaultConfig.rtmp_server;

// NOTE: database/Schema and helpers are legacy references not yet migrated
// eslint-disable-next-line @typescript-eslint/no-require-imports
const User = require('./database/Schema')?.User;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const helpers = require('./helpers/helpers');

declare const nms: InstanceType<typeof NodeMediaServer>;
// @ts-ignore
const nms_ = new NodeMediaServer(config);

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

    User.findOne({stream_key: stream_key}, (err, user) => {
        if (!err) {
            if (!user) {
                let session = nms.getSession(id);
                session.reject();
            } else {
                helpers.generateStreamThumbnail(stream_key);
            }
        }
    });
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms_;
