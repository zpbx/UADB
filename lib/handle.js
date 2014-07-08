'use strict'

var _ = require('underscore')
var UAParser = require('ua-parser-js')
var parser = new UAParser()

function row(row, index) {
	row = _trimUA(row)
	row = _parseUA(row)
	return row
}

function _getUAColumnNameFromRow(row) {
	var validColumns = ['ua', 'user_agent', 'useragent', 'user-agent']
	var currentKeys = _.keys(row)
	var key = ''
	_.each(currentKeys, function (item) {
		if (_.include(validColumns, item.toLowerCase())) {
			key = item
		}
	})
	return key
}
function _getUAFromRow(row) {
	var key = _getUAColumnNameFromRow(row)
	return key ? row[key] : ''
}
function _trimUA(row) {
	var ua = _getUAFromRow(row)
	var key = _getUAColumnNameFromRow(row)
	row[key] = _.str.trim(ua)
	return row
}
function _parseUA(row) {
	var ua = _getUAFromRow(row)
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

function checkUnknown(row) {
	if (
		!row.browser_name ||
//		!row.browser_version ||
		!row.os_name ||
		!row.os_version ||
//		!row.engine_name ||
//		!row.engine_version ||
		null
	) {
		return _getUAFromRow(row)
	} else {
		return ''
	}
}

module.exports = {
	checkUnknown: checkUnknown,
//	getUA: getUA,
	row: row
}
