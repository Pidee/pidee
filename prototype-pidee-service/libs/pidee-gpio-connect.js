// Pidee GPIO
// ==========
// Reads and watches the gpio pins

// Modules
// =======
var W = require( 'w-js' );
var PideeConfig = require( './pidee-config' );
var PideeUtils = require( './pidee-utils' );
var wiringPi = require( 'wiring-pi' );
var Bacon = require( 'baconjs' );

// Make & Init
// ===========
function make () {
    return {
        verbose: false,
        buttonThrottle: 25,
        dipThrottle: 100,
        dipSwitchStreams: [],
        dipStreams: [],
        buttonStreams: [],
        allStream: new Bacon.Bus()
    };
}

wiringPi.wiringPiSetupPhys();

var init = W.composePromisers( loadPideeConfig,
                               PideeUtils.promiseWrap( wiringPi.wiringPiSetupPhys ),
                               enableDip,
                               enabledButton,
                               enableLeds );

// Promisers
// =========

function loadPideeConfig ( connect ) {
    return W.promise( function ( resolve, reject ) {
        PideeConfig
            .init( PideeConfig.make() )
            .success( function ( pideeConfig ) {
                connect.config = pideeConfig;
                resolve( connect );
            })
            .error( reject );
    });
}

function enableDip ( connect ) {
    return W.promise( function ( resolve, reject ) {
        var dipPins = connect.config.get( 'dipPins' );

        // Create the genertic stream
        var dipStream = new Bacon.Bus();

        dipPins.forEach( function ( p, idx ) {
            wiringPi.pinMode( p, wiringPi.INPUT );
            wiringPi.pullUpDnControl( p, wiringPi.PUD_UP );

            var stream = new Bacon.Bus();

            var dipSwitchStream = stream
                .throttle( connect.dipThrottle )
                .map( function ( delta ) { return wiringPi.digitalRead( p ); } )
                .map( function ( v ) { return v === 0 ? 1 : 0; } )
                .map( function ( v ) { return { domain: 'dip.' + idx, value: v }; } );

            // Merge streams
            dipStream = dipStream.merge( dipSwitchStream );
            connect.allStream = connect.allStream.merge( dipSwitchStream );
            
            // Push events to the stream
            wiringPi.wiringPiISR( p, wiringPi.INT_EDGE_BOTH, function ( delta ) {
                stream.push( delta );
            });

            connect.dipSwitchStreams.push( dipSwitchStream );
        });

        // Add the generic dip stream
        dipStream = dipStream
            .map( function () {
                return { domian: 'dip',  value: getDipState( connect ) };
            });

        connect.dipStreams.push( dipStream );
        connect.allStream = connect.allStream.merge( dipStream );
        
        resolve( connect );
    });
}

function enabledButton ( connect ) {
    return W.promise( function ( resolve, reject ) {
        var buttonPins = connect.config.get( 'buttonPins' );
        buttonPins.forEach( function ( p ) {
            wiringPi.pinMode( p, wiringPi.INPUT );
            wiringPi.pullUpDnControl( p, wiringPi.PUD_UP );

            var stream = new Bacon.Bus();

            var buttonStream = stream
                .throttle( connect.buttonThrottle )
                .map( function ( delta ) { return wiringPi.digitalRead( p ); } )
                .map( function ( v ) { return v === 0 ? 1 : 0; } )
                .map( function ( v ) { return { domain: 'button', value: v }; } );
            
            // Push events to the stream
            wiringPi.wiringPiISR( p, wiringPi.INT_EDGE_BOTH, function ( delta ) {
                stream.push( delta );
            });

            connect.buttonStreams.push( buttonStream );
            connect.allStream = connect.allStream.merge( buttonStream );

        });
        resolve( connect );
    });
}

function enableLeds ( connect ) {
    return W.promise( function ( resolve, reject ) {

        connect.allStream.log();

        var ledPins = connect.config.get( 'yrgLedPins' );
        var usePwm = connect.config.get( 'enablePwm' );

        if ( usePwm ) {
            if ( connect.verbose ) { PideeUtils.report( 'Debug', 'Enabling leds with PWM' ); }
            ledPins.forEach( function ( p ) { wiringPi.softPwmCreate( p, 10, 10 ); } );
        } else {
            if ( connect.verbose ) { PideeUtils.report( 'Debug', 'Enabling leds without PWM' ); }
            ledPins.forEach( function ( p ) { wiringPi.pinMode( p, wiringPi.OUTPUT ); } );
        }

        resolve( connect );
    });
}

// Methods
// =======

function setLedState( connect, ledIdx, scalar ) {

    if ( typeof scalar === 'boolean' ) { scalar = scalar ? 1 : 0; }
    
    var ledPins = connect.config.get( 'yrgLedPins' );
    var usePwm = connect.config.get( 'enablePwm' );
    var high = connect.config.get( 'ledOnIsHigh' ) ? 1 : 0;
    var low = connect.config.get( 'ledOnIsHigh' ) ? 0 : 1;

    if ( ledIdx < 0 || ledIdx >= ledPins.length ) {
        PideeUtils.report( 'Error', 'Attempted to set led idx', ledIdx );
        return;
    }
    
    if ( connect.config.get( 'enablePwm' ) ) {
        if ( connect.verbose ) { PideeUtils.report( 'Debug', 'Setting PWM led idx:', ledIdx, 'value:',  Math.floor( W.map( scalar, 1, 0, 0, 1024, true ) ), 'pin:', ledPins[ ledIdx ] ); }
        wiringPi.softPwmWrite( ledPins[ ledIdx ], Math.floor( W.map( scalar, 1, 0, 0, 10, true ) ) );
    } else {
        if ( connect.verbose ) { PideeUtils.report( 'Debug', 'Setting non PWM led idx:', ledIdx, 'value:', scalar >= 0.5 ? wiringPi.LOW : wiringPi.HIGH, 'pin:', ledPins[ ledIdx ] ); }
        wiringPi.digitalWrite( ledPins[ ledIdx ], scalar >= 0.5 ? wiringPi.HIGH : wiringPi.LOW );
    }

}

function getButtonState ( connect ) {
    return wiringPi.digitalRead( connect.config.get( 'buttonPins' )[ 0 ] ) === 1 ? 0 : 1;
}

function getDipState ( connect ) {
    var dipPins = connect.config.get( 'dipPins' );
    
    return [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        .map( function ( idx ) {
            return wiringPi.digitalRead( dipPins[ idx ] );
        })
        .map( function ( v ) { return v === 1 ? 0 : 1; } )
        .reduce( function ( acc, value, idx ) {
            var mask = 1 << idx;
            if ( value ) {
                acc |= mask;
            }
            return acc;
        }, 0 );
}

function getDipSwitchState ( connect, idx ) {
    return wiringPi.digitalRead( connect.config.get( 'dipPins' )[ idx ] );
}


// Export
// ======

module.exports = {
    make: make,
    init: init,
    setLedState: setLedState,
    getButtonState: getButtonState,
    getDipState: getDipState,
    getDipSwitchState: getDipSwitchState
    
};
