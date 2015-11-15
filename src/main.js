var $ = require('jquery')
var _ = { values: require('lodash/object/values') }
var Papa = require('papaparse')
var slug = require('slug')
var template = require('./templates/schema.hbs')
var analyze = require('./analyze')
var knex = require('knex')
require('form-serializer')
require('bootstrap/js/dropdown')

$('#file').on('change', function(e) {
	var file = e.target.files.length ? e.target.files[0] : null
	var fields = {}
	var rowCount = 0
	
	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		step: function(row) {
			rowCount++
			
			for(var key in row.data[0]) {
				var fieldType = analyze.detectType(row.data[0][key])
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
				fields[key].fieldType = analyze.determineWinner(fields[key].fieldTypes)
				fields[key].machineName = slug(key, {
					replacement: '_',
					lower: true
				})
			}
			// Render template
			$('#preview').empty().append(template({fields: fields, rowCount: rowCount}))
		}
	})
})

$(document).on('click', '[data-export]', function(e) {
	var fields = _.values($('form#schema').serializeObject().fields)
	
	// Load a client-specific version of knex
	var exportFormat = $(e.currentTarget).data('export')
	var knexClient = knex({client: exportFormat})
	
	var sql = knexClient.schema.createTable('foo', function(table) {
		fields.forEach(function(field) {
			if(table[field.fieldType] !== undefined) {
				table[field.fieldType](field.machineName)
			}
		})
	})
	console.log(sql.toString())
	
	e.preventDefault()
})