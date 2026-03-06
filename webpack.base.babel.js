import 'dotenv/config';
import cssnext from 'postcss-cssnext';
import cssimport from 'postcss-import';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack'
import HappyPack from 'happypack';


export default {

    module: {

        devtool: 'source-map',

        debug: true,
        hash: true,

        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    process.env.NODE_ENV==="production"
                        ? "css-loader?minimize&modules&importLoaders=1&localIdentName=[local]-[hash:base64:5]!postcss-loader"
                        : "css-loader?modules&importLoaders=1&localIdentName=[local]-[hash:base64:5]!postcss-loader"
                )
            },

            {
                test : /\.js$/,
                exclude: /node_modules/, // add this line
                loaders: [ 'happypack/loader' ] // replaced... loader  : 'babel-loader'
            },
            {
                test : /\.json$/,
                loader  : 'json-loader'
            },

            {
                test: /\.(png|jpe?g|gif|svg|mp3|mpe?g)$/,
                loader: "file-loader?name=static/assets/[name]-[hash:2].[ext]"
            }

        ]

    },
		node: {
		  fs: 'empty'
		},
		externals: [
			{
      './cptable': 'var cptable'
	    },
	    {
	      './jszip': 'jszip'
	    }
		],
    plugins: [
        new ExtractTextPlugin("app.css"),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV||"production"}"`
        }),
        new HappyPack({
            // loaders is the only required parameter:
            loaders: [ 'babel?presets[]=es2015&plugins[]=transform-class-properties' ]

            // customize as needed, see Configuration below
        }),
    ],


    cssLoader: {
        modules: true
    },

    postcss : [
        cssimport({ path: `${__dirname}/src/app` }),
        cssnext()
    ]
};
