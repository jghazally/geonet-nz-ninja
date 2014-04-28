var secrets = require('./secrets.js'),
	_ = require('underscore'),
	request = require('request'),
	ninjaBlocks = require('ninja-blocks');

var ninja = ninjaBlocks.app({user_access_token:secrets.USER_ACCESS_TOKEN});
	recentQuake = 0,
	magnitude = 0,
	colors = {
	0: '8f00ff', // Violet
	1: '4b0082', // Indigo
	2: '0000ff', // Blue
	3: '00ff00', // Green
	4: 'ffff00', // Yellow
	5: 'ff7f00', // Orange
	6: 'ff0000', // Red
	7: 'ffffff' // White
};

function checkGeonet() {
	request.get('http://www.geonet.org.nz/quakes/services/all.json', function(err, res, body) {
		if ( !err && res.statusCode == 200 ) {
			body = JSON.parse(body);
			thisQuake = body.features[0];
			if ( thisQuake.id != recentQuake ) {
				recentQuake = thisQuake.id;
				magnitude = thisQuake.properties.magnitude.toFixed(0);
				changeColor();
			}
		}
	});
}

function changeColor() {
	ninja.devices({ device_type: 'rgbled' }, function(err, devices) {
		_.each(devices, function(device, guid) {
			console.log('NZ Hit by a ' + magnitude + 'M quake');
			ninja.device(guid).actuate(colors[magnitude]);
		});
	});
}

setInterval(checkGeonet, 5000);
