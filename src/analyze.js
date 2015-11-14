var moment = require('moment')
var _ = {
	keys: require('lodash/object/keys')
}

exports.detectType = function(sample) {
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
exports.determineWinner = function(fieldTypes) {
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
