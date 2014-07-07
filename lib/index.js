'use strict'

var _ = require('underscore')
var fs = require('fs')
var csv = require('csv')
var handle = require('./handle')

var input = __dirname + '/../data/input.csv'
var output = __dirname + '/../data/output.csv'

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

//log
var splitter = '------------------------------------------------------------'

//time log
var start = Date.now()

//unknown log
var unknownUAs = []

csv()
	.from.stream(fs.createReadStream(input), readOptions)
	.to.path(output, writeOptions)
	.transform(handle.row)
	.on('record', function (row, index) {
		//item log
		if (index % 10 === 0) {
//			console.log(index)
//			console.log('#' + index + ': ' + JSON.stringify(row))
		}
		//unknown log
		var ua = handle.checkSuccess(row)
		if (ua) {
			unknownUAs.push(ua)
		}
	})
	.on('close', function (count) {
		// when writing to a file, use the 'close' event
		// the 'end' event may fire before the file has been written
		//item log
		console.log('Number of lines: ' + count)
		console.log(splitter)

		//time log
		var end = Date.now()
		console.log('Elapsed time: ' + (end - start) + 'ms')
		console.log(splitter)

		//unknown log
		console.log('Number of unknown UA: ' + unknownUAs.length)
		_.each(unknownUAs, function (ua, index) {
			console.log('- ' + ua)
		})
		console.log(splitter)
	})
	.on('error', function (error) {
		console.log(error.message)
	});

//var ua = 'mozilla/5.0 (iphone; cpu iphone os 7_1_1 like mac os x) applewebkit/537.51.2 (khtml, like gecko) version/7.0 mobile/11d201 safari/9537.53'
//console.log(parser.setUA(ua).getResult());

/*
{
	ua: 'mozilla/5.0 (iphone; cpu iphone os 7_1_1 like mac os x) applewebkit/537.51.2 (khtml, like gecko) version/7.0 mobile/11d201 safari/9537.53',
	browser: {
		name: 'Mobile Safari',
		version: '7.0',
		major: '7'
	},
	engine: {
		name: 'webkit',
		version: '537.51.2'
	},
	os: {
		name: 'iOS',
		version: '7.1.1'
	},
	device: {
		model: 'iphone',
		vendor: 'apple',
		type: 'mobile'
	},
	cpu: {
		architecture: undefined
	}
}
*/




