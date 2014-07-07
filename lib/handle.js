var _ = require('underscore')
var UAParser = require('ua-parser-js')
var parser = new UAParser()

var validKeys = ['ua', 'user_agent', 'useragent', 'user-agent', 'userAgent']
function row(row, index) {
//	console.log(JSON.stringify(row))
//	row = _formatKeys(row)
	row = _parseUA(row)
	return row
}

function _formatKeys(row) {
	_.each(deprecatedKeys, function (item) {
		var ua = row[item]
		if (ua && _.isString(ua)) {
			row.ua = ua
			delete row[item]
		}
	})
	return row
}
function _getUA(row) {
	var result = ''
	_.each(validKeys, function (item) {
		var ua = row[item]
		if (ua && _.isString(ua)) {
			result = ua
		}
	})
	return result
}
function _parseUA(row) {
	var ua = _getUA(row)
	var data = parser.setUA(ua).getResult()
//	console.log(data)
	row.browser_name = _formatValue(data.browser.name)
	row.browser_version = _formatValue(data.browser.version)
	row.os_name = _formatValue(data.os.name)
	row.os_version = _formatValue(data.os.version)
	row.engine_name = _formatValue(data.engine.name)
	row.engine_version = _formatValue(data.engine.version)
	row.device_vendor = _formatValue(data.device.vendor)
	row.device_model = _formatValue(data.device.model)
	row.device_type = _formatValue(data.device.type)
	return row
}

function _formatValue(val) {
	return (val || '').toLowerCase()
}

function checkSuccess(row) {
	if (
		!row.browser_name ||
		!row.browser_version ||
		!row.os_name ||
		!row.os_version ||
		!row.engine_name ||
		!row.engine_version ||
		null
	) {
		return _getUA(row)
	} else {
		return ''
	}
}

module.exports = {
	checkSuccess: checkSuccess,
//	getUA: getUA,
	row: row
}
