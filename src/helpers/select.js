var $ = require('jquery')

module.exports = function(value, options){
	var $el = $('<select />').html(options.fn(this))
	$el.find('[value="' + value + '"]').attr({'selected':'selected'})
	return $el.html()
}