// Pidee Config
// ============
// Reads and tests /etc/pidee.conf. If it doesn't find it, it will create it.

// Modules
// =======
var W = require( 'w-js' );
var PideeUtils = require( './pidee-utils' );
var fs = require( 'fs' );

// Make & Init
// ===========
function  make () {
    return {
        src: '/etc/pidee.conf',
        defaultSettings: {
            yrgLedPins: [ 35, 33, 32 ],
            dipPins: [ 31, 29, 22, 18, 16, 15, 13, 11 ],
            enablePwm: false,
            buttonPins: [ 12 ],
            ledOnIsHigh: false
        }
    };
}

var init = W.composePromisers( doMakeConfigFile, enableConfig );

// Features
// ========

// Stats the config file and creates if missing
function doMakeConfigFile ( pideeConfig ) {
    return W.promise( function ( resolve, reject ) {
        fs.stat( pideeConfig.src, function ( err ) {
            if ( !err ) { return resolve( pideeConfig ); }
            fs.writeFile( pideeConfig.src, JSON.stringify( pideeConfig.defaultSettings, null, 2 ), function ( err ) {
                if ( err ) { return reject( err ); }
                resolve( pideeConfig );
            });
        });
    });       
}

function enableConfig ( pideeConfig ) {
    return W.promise( function ( resolve, reject ) {

        // Load the config file
        fs.readFile( pideeConfig.src, function ( err, data ) {
            if ( err ) { return reject( err ); }

            // Parse it
            var settings;
            try {
                settings = JSON.parse( data.toString() );
            } catch ( err ) {
                return reject( err );
            }

            // Add the getters and setters
            pideeConfig.get = function ( key ) {
                return settings[ key ];
            };

            resolve( pideeConfig );
        });
    });
}

// Export
// ======
module.exports = {
    make: make,
    init: init
};

