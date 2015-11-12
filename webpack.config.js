module.exports = {
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.hbs$/, loader: 'handlebars-loader?helperDirs[]=' + __dirname + '/src/helpers' }
		]
	}
}