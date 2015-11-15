var Vue = require('vue')
var _ = { values: require('lodash/object/values') }
var analyze = require('./analyze')
var exportSql = require('./export-sql')
require('bootstrap/js/dropdown')

new Vue({
	el: 'body',
	data: function() {
		return {
			fields: {},
			rowCount: null
		}
	},
	methods: {
		fileChange: function(e) {
			var context = this
			var file = e.target.files.length ? e.target.files[0] : null
			analyze(file).done(function(analysis) {
				context.fields = analysis.fields
				context.rowCount = analysis.rowCount
			})
		},
		exportData: function(client) {
			console.log(exportSql('foo', _.values(this.fields), client))
		}
	}
})