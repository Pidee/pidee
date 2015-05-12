// Pidee GPIO
// ==========
// Reads and watches the gpio pins

// Modules
// =======
var W = require( 'w-js' );
var PideeConfig = require( './pidee-config' );
var PideeUtils = require( './pidee-utils' );
var wiringPi = require( 'wiring-pi' );

// Make & Init
// ===========
function make () {
    return {};
}

wiringPi.wiringPiSetupPhys();

var init = W.composePromisers( loadPideeConfig,
                               PideeUtils.promiseWrap( wiringPi.wiringPiSetupPhys ),
                               doEnableDips,
                               doEnabledButtons,
                               doEnableLeds );

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

function doEnableDips ( connect ) {
    return W.promise( function ( resolve, reject ) {
        resolve( connect );
    });
}

function doEnabledButtons ( connect ) {
    return W.promise( function ( resolve, reject ) {
        resolve( connect );
    });
}

function doEnableLeds ( connect ) {
    return W.promise( function ( resolve, reject ) {

        var ledPins = connect.config.get( 'ygrLedPins' );
        var usePwm = connect.config.get( 'enablePwm' );

        if ( usePwm ) {
            PideeUtils.report( 'Debug', 'Enabling leds with PWM' );
            // ledPins.forEach( function ( p ) { wiringPi.pinMode( p, wiringPi.SOFT_PWM_OUTPUT ); } );
            ledPins.forEach( function ( p ) { wiringPi.softPwmCreate( p, 10, 10 ); } );
        } else {
            PideeUtils.report( 'Debug', 'Enabling leds without PWM', wiringPi.OUTPUT );
            ledPins.forEach( function ( p ) { console.log( p ); wiringPi.pinMode( p, wiringPi.OUTPUT ); } );
        }

        resolve( connect );
    });
}

// Methods
// =======

function setLedState( connect, ledIdx, scalar ) {

    if ( typeof scalar === 'boolean' ) { scalar = scalar ? 1 : 0; }
    
    var ledPins = connect.config.get( 'ygrLedPins' );
    var usePwm = connect.config.get( 'enablePwm' );

    if ( ledIdx < 0 || ledIdx >= ledPins.length ) {
        PideeUtils.report( 'Error', 'Attempted to set led idx', ledIdx );
        return;
    }
    
    if ( connect.config.get( 'enablePwm' ) ) {
        PideeUtils.report( 'Debug', 'Setting PWM led idx:', ledIdx, 'value:',  Math.floor( W.map( scalar, 1, 0, 0, 1024, true ) ), 'pin:', ledPins[ ledIdx ] );
        wiringPi.softPwmWrite( ledPins[ ledIdx ], Math.floor( W.map( scalar, 1, 0, 0, 10, true ) ) );
    } else {
        PideeUtils.report( 'Debug', 'Setting non PWM led idx:', ledIdx, 'value:', scalar >= 0.5 ? wiringPi.LOW : wiringPi.HIGH, 'pin:', ledPins[ ledIdx ] );
        wiringPi.digitalWrite( ledPins[ ledIdx ], scalar >= 0.5 ? wiringPi.LOW : wiringPi.HIGH );
    }

}

// Export
// ======

module.exports = {
    make: make,
    init: init,
    setLedState: setLedState
};
