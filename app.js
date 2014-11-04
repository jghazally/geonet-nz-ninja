var secrets = require('./secrets.js'),
	_ = require('underscore'),
	request = require('request'),
	argv = require('yargs').argv,
	ninjaBlocks = require('ninja-blocks');

var geonetNZNinja = {
	ninja: ninjaBlocks.app({user_access_token:secrets.USER_ACCESS_TOKEN}),
	recentQuake: 0,
	magnitude: 0,
	colors: {
		0: '8f00ff', // Violet
		1: '4b0082', // Indigo
		2: '0000ff', // Blue
		3: '00ff00', // Green
		4: 'ffff00', // Yellow
		5: 'ff7f00', // Orange
		6: 'ff0000', // Red
		7: 'ffffff' // White
	},

	init: function() {
		_geonetNZNinja = this;
		setInterval(this.checkGeonet, 5000);
	},

	log: function(message) {
		if ( argv.debug ) {
			console.log(message);
		}
	},

	checkGeonet: function() {
		request.get('http://www.geonet.org.nz/quakes/services/all.json', function(err, res, body) {
			if ( !err && res.statusCode == 200 ) {
				body = JSON.parse(body);
				thisQuake = body.features[0];
				if ( thisQuake.id != _geonetNZNinja.recentQuake ) {
					_geonetNZNinja.recentQuake = thisQuake.id;
					_geonetNZNinja.magnitude = thisQuake.properties.magnitude.toFixed(0);
					_geonetNZNinja.changeColor();
					_geonetNZNinja.log('New Quake ' + _geonetNZNinja.magnitude + 'M detected');
				}
			}
		});
	},

	setColor: function(color) {
		_geonetNZNinja.ninja.devices({ device_type: 'rgbled' }, function(err, devices) {
			_.each(devices, function(device, guid) {
				_geonetNZNinja.log('Change Color ' + color);
				_geonetNZNinja.ninja.device(guid).actuate(color);
			});
		});
	},

	animateColor: function() {
		if ( typeof _geonetNZNinja.colors[_geonetNZNinja.colorIndex] == 'undefined') {
			_geonetNZNinja.setColor(_geonetNZNinja.colors[_geonetNZNinja.magnitude]);
		} else {
			_geonetNZNinja.setColor(_geonetNZNinja.colors[_geonetNZNinja.colorIndex]);
			_geonetNZNinja.colorIndex++;
			setTimeout(_geonetNZNinja.animateColor, 400);
		}
	},

	changeColor: function() {
		// Do a little animation of colours
		this.colorIndex = 0;
		this.animateColor();
	}
}

geonetNZNinja.init();
