import base from './webpack.base.babel.js';
import path from 'path';
import webpack from 'webpack';

const {WDS_PORT, PORT, APP_WEB_BASE_PATH} = process.env;

export default {
    ...base,

    entry: "./src/app/_client.js",
    output: {
        path: path.join(__dirname, 'dist', 'static'),
        filename: "app.js",
        chunkFilename: '1.app.js',
        //publicPath: `${APP_WEB_BASE_PATH}/`
        //publicPath: path.join( __dirname, '/static/' ),
        publicPath: '/static/',
    },

    plugins: base.plugins
        .concat(process.env.NODE_ENV==="production"
            ? [
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compressor: {
                        warnings: false
                    },
                    sourcemaps: true
                })
            ]
            : []
        ),

    devServer: {
        publicPath: '/static/',
        contentBase: `http://127.0.0.1:${PORT}/static`,
        historyApiFallback: true,
        progress: false,
        stats: 'errors-only',
        compress: true,
        port: WDS_PORT,
        proxy: {
            "**": `http://127.0.0.1:${PORT}`
        }
    }

};
