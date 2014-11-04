#Geonet NZ Ninja
Geonet NZ Ninja is an exploration into node as much as it is a taste of the Ninja Block Developers Tools
The simple 30 line app fetches a json file every 5 seconds from Geonet
and changes Nina's Eye colour depending on the magnitude of the most
recent quake.

##Installation

* ` git clone https://github.com/jghazally/geonet-nz-ninja.git`
* `cd geonet-nz-ninja`
* `npm install`
* `cp sample.secrets.json secrets.json`

You will need to add in your Ninja Block API Key into the secrets.json
file.

## Quake size to Colours

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

