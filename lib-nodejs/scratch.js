var Pidee = require( './index' );

var pidee = new Pidee();

pidee.open( function () {
    
    console.log( 'Scratch: pidee opened' );

    var getters = [ 'dip', 'dip.0', 'dip.1', 'dip.2', 'dip.3', 'dip.4', 'dip.5', 'dip.6', 'dip.7', 'button' ];
    var setters = [ 'led.yellow', 'led.green', 'led.red' ];

    // Get all
    getters.forEach( function ( domain ) { console.log( 'get >>', domain , pidee.get( domain ) ); } );

    // Subscribe all 
    getters.forEach( function ( domain ) {
        pidee.on( domain, function ( value ) {
            console.log( 'on >>', domain, value) ;
        });
    });

    // Light looper
    setters.forEach( function ( domain ) {
        var state = false;
        (function loop() {
            setTimeout( loop, randomBetween( 500, 2000 ) );
            state = !state;
            //console.log( 'set >>', domain, state ? Pidee.ON : Pidee.OFF );
            pidee.set( domain, state ? Pidee.ON : Pidee.OFF );
        }());
    });    
    
});

pidee.on( 'error', function ( err, errorCode, message ) {
    if ( typeof errorCode === 'undefined' ) {
        console.log( 'Scratch on Error', err );
    } else {
        console.log( 'Scratch on Error', err, errorCode, message );
    }
});

// Utils
// =====

function randomBetween (from, to) {
    return map(Math.random(), 0, 1, from, to);
}

// # Map (map interval)
// Ease function can be a interpolation function as below
function map ( input, inputMin, inputMax, outputMin, outputMax, clamp, ease ) {
    input = ( input - inputMin ) / ( inputMax - inputMin );
    if ( ease ) {
        input = ease(input);
    } 
    var output = input * ( outputMax - outputMin ) + outputMin;
    if ( !!clamp ) {
        if ( outputMax < outputMin ) {
            if ( output < outputMax ) {
                output = outputMax;
            }
            else if ( output > outputMin ) {
                output = outputMin;
            }
        } else {
            if ( output > outputMax ) {
                output = outputMax;
            }
            else if ( output < outputMin ) {
                output = outputMin;
            }
        }
    }
    return output;
}
