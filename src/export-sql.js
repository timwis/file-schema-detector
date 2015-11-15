var Knex = require('knex')

module.exports = function(tableName, fields, client) {
	// Load a client-specific version of knex
	var knex = Knex({client: client})
	
	var sql = knex.schema.createTable(tableName, function(table) {
		fields.forEach(function(field) {
			if(table[field.fieldType] !== undefined) {
				table[field.fieldType](field.machineName)
			}
		})
	})
	return sql.toString()
}