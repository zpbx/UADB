'use strict'

var _ = require('underscore')
_.str = require('underscore.string')
var fs = require('fs')
var csv = require('csv')
var handle = require('./handle')

var input = __dirname + '/../data/input.csv'
//var input = __dirname + '/../data/input-2k.csv'
//var input = __dirname + '/../data/input-20k.csv'
var output = __dirname + '/../data/output.csv'

var pathUnknown = '../data/output-unknown.csv'
var outputUnknown = __dirname + '/' + pathUnknown

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
	trim: true
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
var tsStart = Date.now()
var indexDone = 0

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
		//we want index to start from 1, not 0
		if (index === 1) {
			console.log(splitter)
		}
		index++
		if (index % step === 0) {
			indexDone = index
			console.log('Processing: #' + (indexDone - step + 1) + ' ~ #' + indexDone)
		}
		//unknown log
		var ua = handle.checkUnknown(row)
		if (ua) {
			if (!_.include(listUnknownUA, ua)) listUnknownUA.push(ua)
			listUnknownRow.push([index, ua])
		}
	})
	.on('close', function (count) {
		// when writing to a file, use the 'close' event
		// the 'end' event may fire before the file has been written

		if (!enableLog) return
		//item log
		if (count > indexDone) {
			if (count - indexDone === 1) {
				console.log('Processing: #' + count)
			} else {
				console.log('Processing: #' + indexDone + ' ~ #' + count)
			}
		}
		console.log(splitter)
		console.log('Amount of records: ' + count)

		//time log
		var tsEnd = Date.now()
		console.log('Elapsed time: ' + (tsEnd - tsStart) + 'ms')
		console.log(splitter)

		//unknown log
		console.log('Amount of unknown UAs: ' + listUnknownUA.length)
		var len = listUnknownRow.length
		console.log('Amount of unknown records: ' + len)
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
				.on('close', function (countUnknown) {
					console.log('Saved all ' + countUnknown + ' unknown UAs to: ' + pathUnknown)
					console.log(splitter)
					logCoverage(count - len, count)
				})
		} else {
			console.log(splitter)
			logCoverage(count - len, count)
		}

		//coverage log
		function logCoverage(success, total) {
			var coverage = total ? success / total : 0
			coverage = (coverage * 100).toFixed(2) + '%'
			console.log('Coverage: ' + coverage)
			console.log(splitter)
		}

	})
	.on('error', function (error) {
		console.log(error.message)
	});

