var webpack = require('webpack')

module.exports = {
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			//{ test: /\.hbs$/, loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/src/helpers' }
			{ test: /\.vue$/, loader: 'vue' }
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