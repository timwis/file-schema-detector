var Knex = require('knex')

module.exports = function(tableName, fields, client) {
	// Load a client-specific version of knex
	var knex = Knex({client: client})
	
	var sql = knex.schema.createTable(tableName, function(table) {
		fields.forEach(function(field) {
			var column
			if(field.fieldType === 'string') {
				column = table.string(field.machineName, field.maxLength) // perhaps currying makes more sense here?
			} else if(table[field.fieldType] !== undefined) {
				column = table[field.fieldType](field.machineName)
			} else {
				column = table.specificType(field.fieldType, field.machineName)
			}
			if(field.nullable) column.nullable()
		})
	})
	return sql.toString()
}