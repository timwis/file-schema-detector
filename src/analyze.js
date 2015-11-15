var Promise = require('bluebird')
var Papa = require('papaparse')
var slug = require('slug')
var moment = require('moment')
var _ = { keys: require('lodash/object/keys') }

var detectType = function(sample) {
	if(sample === '') {
		return 'null'
	} else if(moment(sample, moment.ISO_8601, true).isValid()) {
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
		return 'string'
	}
}

/**
 *  Determine which type wins
 *  - timestamp could be int
 *  - integer could be float
 *  - everything could be string
 *  - if detect an int, don't check for timestamp anymore, only check for float or string
 *  - maybe this optimization can come later...
 */
var determineWinner = function(fieldTypes) {
	var keys = _.keys(fieldTypes)
	
	if(keys.length === 1) {
		return keys[0]
	} else if(fieldTypes.string) {
		return 'string'
	} else if(fieldTypes.float) {
		return 'float'
	} else if(fieldTypes.integer) {
		return 'integer'
	} else { // TODO: if keys.length > 1 then... what? always string? what about date + datetime?
		return fieldTypes[0]
	}
}

module.exports = function(file) {
	var fields = {}
	var rowCount = 0
	
	return new Promise(function(resolve, reject) {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			step: function(row) {
				rowCount++
				
				for(var key in row.data[0]) {
					var fieldType = detectType(row.data[0][key])
					if( ! fields[key]) fields[key] = { fieldTypes: {}, sample: null, maxLength: 0 }
					
					// Tally the presence of this field type
					if( ! fields[key].fieldTypes[fieldType]) fields[key].fieldTypes[fieldType] = 0
					fields[key].fieldTypes[fieldType]++
					
					// Set nullable
					if(fieldType === 'null' && ! fields[key].nullable) {
						fields[key].nullable = true
					}
					
					// Save a sample record if there isn't one already (earlier rows might have an empty value)
					if( ! fields[key].sample && row.data[0][key]) {
						fields[key].sample = row.data[0][key]
					}
					
					// Save the largest length
					fields[key].maxLength = Math.max(fields[key].maxLength, row.data[0][key].length)
				}
			},
			complete: function() {
				for(var key in fields) {
					// Determine which field type wins
					fields[key].fieldType = determineWinner(fields[key].fieldTypes)
					fields[key].machineName = slug(key, {
						replacement: '_',
						lower: true
					})
				}
				resolve({fields: fields, rowCount: rowCount})
			}
		})
	})
}