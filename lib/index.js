'use strict'

var _ = require('underscore')
_.str = require('underscore.string')
var fs = require('fs')
var csv = require('csv')
var handle = require('./handle')

var input = __dirname + '/../data/input.csv'
//var input = __dirname + '/../data/input-complete.csv'
var output = __dirname + '/../data/output.csv'
var outputUnknown = __dirname + '/../data/output-unknown.csv'

var readOptions = {
	delimiter: ';',
	lineBreaks: 'unix',
//	rowDelimiter: 'unix',
	comment: '#',
	columns: true,
	trim: true
}
var writeOptions = {
	header: true,
	delimiter: ';',
	rowDelimiter: 'unix',
	newColumns: true,
	flags: 'w',
//	end: false,
	eof: true
}
var readUnknownOptions = {
	delimiter: ';',
	lineBreaks: 'unix',
//	rowDelimiter: 'unix',
	comment: '#',
//	columns: true,
//	trim: true
}
var writeUnknownOptions = {
//	header: true,
	delimiter: 'none',
	rowDelimiter: 'unix',
	flags: 'w',
	quote: '',
//	end: false,
	eof: true
}

//log
var enableLog = true
var step = 10
var splitter = '------------------------------------------------------------'

//time log
var start = Date.now()

//unknown log
var listUnknownUA = []
var listUnknownRow = []

csv()
	.from.stream(fs.createReadStream(input), readOptions)
	.to.path(output, writeOptions)
	.transform(handle.row)
	.on('record', function (row, index) {
		if (!enableLog) return
		//item log
		index++
		if (index % step === 0) {
			console.log('Parsing: #' + index)
		}
		//unknown log
		var ua = handle.checkSuccess(row)
		if (ua && !_.include(listUnknownUA, ua)) {
			if (ua.length > 20 || _.str.include(ua, '/') || _.str.include(ua, ';')) {
				listUnknownUA.push(ua)
				listUnknownRow.push([index, ua])
			}
		}
	})
	.on('close', function (count) {
		// when writing to a file, use the 'close' event
		// the 'end' event may fire before the file has been written

		if (!enableLog) return
		//item log
		console.log(splitter)
		console.log('Number of records: ' + count)

		//time log
		var end = Date.now()
		console.log('Elapsed time: ' + (end - start) + 'ms')
		console.log(splitter)

		//unknown log
		var len = listUnknownRow.length
		console.log('Number of unknown UA: ' + len)
		_.each(listUnknownRow, function (ua, index) {
			if (index < 10) {
				console.log('#' + ua[0] + ' - ' + ua[1])
			}
		})
		if (len > 10) {
			console.log('...')
			var list = _.map(listUnknownUA, function (item) {
				return [item]
			})
			csv()
				.from.array(list, readUnknownOptions)
				.to.path(outputUnknown, writeUnknownOptions)
				.on('close', function (count) {
					console.log('Saved all ' + count + ' unknown UA to: ' + outputUnknown)
					console.log(splitter)
				})
		} else {
			console.log(splitter)
		}
	})
	.on('error', function (error) {
		console.log(error.message)
	});

