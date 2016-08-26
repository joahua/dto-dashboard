import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BellOnBundlerErrorPlugin from 'bell-on-bundler-error-plugin';
import autoprefixer from 'autoprefixer';

import * as CONFIG from './_config';
const projectName = require('./../package').name;


let ExtractSass = new ExtractTextPlugin("stylesheets/[name].css", {
  publicPath: CONFIG.DIR_DIST,
  allChunks: false
});

let webpackConfig = {
	name: projectName,
    bail: true,
	debug: true,
	devtool: 'source-map',
	target: 'web',
	context: CONFIG.DIR_SRC,
	entry: {
    ['dashboard']: [`./dashboard`],
  },
	output: {
		filename: 'javascripts/[name].js',
		path: CONFIG.DIR_DIST,    // absolute - determines output dir
		sourceMapFilename: "javascripts/[name].js.map"
	},
  // When you want to import a global API into the bundle
	externals: {
	},
	module: {
    // Pre-process files as they are loaded by "import" statements.
    // Similar to a gulp task.
    // Chains are applied right to left,
    // Can accept options by query params or by object syntax below,
    // see "sassLoader"
		preLoaders: [
			{
				test: /client\/src\/\.(js)$/,
				loader: "eslint"
			}
		],
		loaders: [
			{
				test: /\.(js|json)$/,
				loaders: ['babel'],
        exclude: [
          CONFIG.DIR_NPM,
          CONFIG.DIR_TEST
        ],
			},
			{
				test: /\.(scss|css)$/,
				loader: ExtractSass.extract('style', 'css?&sourceMap!postcss!sass?sourceMap')
			},
			{
				test: /\.(jpe?g|gif|png|svg)$/,
				loader: "file?name=images/[name].[ext]"
			},
			{
				test: /\.(eot|ttf|woff|svg|woff2)$/,
				loader: "url?limit=10000&name=fonts/[name].[ext]"
			}
		]
	},
  // Add functionality typically related to bundles in webpack
  plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(CONFIG.ENV),
		}),
		new BellOnBundlerErrorPlugin(),
		ExtractSass
	],
  // Options affecting the resolving of modules
  resolve: {
		extensions : ['', '.js', '.scss'],
	},
	node: {
		fs: 'empty'
	},


  //
  // loader options
  //

	postcss : [
	  autoprefixer()
  ],
	sassLoader: {
		precision: 8,
		includePaths: [
			CONFIG.DIR_SRC,
			CONFIG.DIR_NPM
		],
		sourceMap: true,
		lineNumbers: true,
		bundleExec: true,
		data: `$env:  ${CONFIG.ENV === 'production' ? 'production' : 'development'};`
	}
};


export default webpackConfig;
