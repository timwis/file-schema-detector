var Papa = require('papaparse')
var moment = require('moment')
var template = require('./templates/schema.hbs')

var detectType = function(sample) {
	if(moment(sample, moment.ISO_8601, true).isValid()) {
		return 'datetime'
	} else if(moment(sample, 'YYYY-MM-DD', true).isValid()) {
		return 'date'
	} else if(moment(sample, 'X', true).isValid() && +sample >= 31536000) {
		// sanity check since '1' is technically a timestamp (>= 1971)
		return 'timestamp'
	} else if( ! isNaN(sample) && sample.indexOf('.') !== -1) {
		return 'float'
	} else if( ! isNaN(sample)) {
		return 'integer'
	} else {
		console.log(sample, Number(sample))
		return 'string'
	}
}

document.getElementById('file').addEventListener('change', function(e) {
	var file = e.target.files.length ? e.target.files[0] : null
	
	Papa.parse(file, {
		header: true,
		complete: function(results) {			
			// Detect types of first row
			var fields = {}
			for(var key in results.data[0]) {
				fields[key] = {
					sample: results.data[0][key],
					'type': detectType(results.data[0][key])
				}
			}
			
			// Render template
			document.getElementById('preview').innerHTML = template({fields: fields})
		}
	})
})