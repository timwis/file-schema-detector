var Vue = require('vue')
var _ = { keys: require('lodash/object/keys'), values: require('lodash/object/values') };
require('bootstrap/js/dropdown')

var analyze = require('./analyze')
var exportSql = require('./export-sql')
var template = require('./template.html')

new Vue({
	el: '#main',
	template: template,
	data: function() {
		return {
			fields: {},
			fieldCount: null,
			rowCount: null
		}
	},
	methods: {
		fileChange: function(e) {
			var context = this
			var file = e.target.files.length ? e.target.files[0] : null
			analyze(file).done(function(analysis) {
				context.fields = analysis.fields
				context.fieldCount = _.keys(analysis.fields).length
				context.rowCount = analysis.rowCount
			})
		},
		exportData: function(client) {
			console.log(exportSql('foo', _.values(this.fields), client))
		}
	}
})
