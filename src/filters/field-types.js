module.exports = function(fieldTypes) {
	var items = []
	for(var fieldType in fieldTypes) {
		items.push(fieldType + ' (' + fieldTypes[fieldType] + ')')
	}
	return items.join('<br>')
}