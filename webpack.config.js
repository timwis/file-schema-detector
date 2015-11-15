var webpack = require('webpack')

module.exports = {
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.html$/, loader: 'html-loader' }
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/unicode\/category\/So/),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
}