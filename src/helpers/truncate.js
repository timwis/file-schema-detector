var Handlebars = require('handlebars')

module.exports = function(str, len) {
  return str.length > len ? str.substr(0, len) + Handlebars.escapeExpression('&hellip;') : str
}