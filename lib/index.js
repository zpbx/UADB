var csv = require('csv')
var UAParser = require('ua-parser-js')
var parser = new UAParser()

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




