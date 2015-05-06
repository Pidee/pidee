// Modules
// =======

var W = require( 'w-js' );
var wpi = require( 'wiring-pi' );

// Setup
// =====

var init = W.composeAsync( setupWiringPiPhys
                           //, toggleLeds
                           , breathPwmLeds
                           , readDip
                           , enableButtons );

init({
    ygrLedPins: [  ], // Final Version Will be: Yellow, Red, Green[ 40, 38, 36 ]
    pwmLeds: [ 40, 38, 36 ],
    dipPins: [ 31, 29, 22, 18, 16, 15, 13, 11, 12 ],
    buttonPins: [ null ]
}, makeReporter( 'FINISHED', 'Initialized app' ) );

function setupWiringPiPhys ( app, done ) {
    wpi.wiringPiSetupPhys();
    W.call( done, app );
}

function toggleLeds ( app, done ) {
    app.ygrLedPins.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.pinMode( pinNumber, wpi.OUTPUT ); } );
    var state = true;
    (function  loop () {
        state = !state;
        app.ygrLedPins.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.digitalWrite( pinNumber, state ? wpi.LOW : wpi.HIGH ); } );
        setTimeout( loop, 1000 );
    }());
    W.call( done, app );
}

function breathPwmLeds ( app, done ) {
    app.pwmLeds.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.pinMode( pinNumber, wpi.SOFT_PWM_OUTPUT ); } );
    app.pwmLeds.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.softPwmCreate( pinNumber, 100, 100 ); } );
    (function  loop () {
        app.pwmLeds.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.softPwmWrite( pinNumber, Math.floor( W.map( Math.sin( Date.now() / 100 ), -1, 1, 0, 100, true ) ) ); } );
        setTimeout( loop, 10 );
    }());
    W.call( done, app );
}

function readDip ( app, done ) {
    app.dipPins.forEach( function ( pinNumber ) { wpi.pinMode( pinNumber, wpi.INPUT ); } );
    app.dipPins.forEach( function ( pinNumber ) { wpi.pullUpDnControl( pinNumber, wpi.PUD_UP ); } );
    report( 'DIP', app.dipPins.map( function ( pinNumber ) { return wpi.digitalRead( pinNumber ); } ).map( function ( v ) { return v ===  1 ? 0 : 1  } ).join( '' ) );
    report( 'DIP Parsed', parseInt( app.dipPins.map( function ( pinNumber ) { return wpi.digitalRead( pinNumber ); } ).map( function ( v ) { return v ===  1 ? 0 : 1  } ).join( '' ), 2 ) );
    W.call( done, app );
}

function enableButtons ( app, done ) {
    app.buttonPins.filter( function ( pinNumber ) { return pinNumber !== null; } ).forEach( function ( pinNumber ) { wpi.wiringPiISR( pinNumber, wpi.INT_EDGE_BOTH, makeReporter( 'BUTTON CHANGE' ) ); } );
    W.call( done, app );
}

// Utils
// =====

// Reporting
// ---------
function report( status, str ) {
    console.log( '[', status, ']', W.rest( W.toArray( arguments ) ).join( ' ' ) );
}

function makeReporter( status, str ) {
    return function ( app, done ) {
        report( status, str );
        W.call( done, app );
    };
}
