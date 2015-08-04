// Pidee
// =====
// A node module for interacting with the pidee
//
// Usage:
//
//    var Pidee = require( 'pidee' );
//    
//    var pidee = new Pidee;
//
//    pidee.open( function ( connection ) {
//        
//        pidee.get( 'dip.1' ) // 1
//        
//        pidee.on( 'button', function ( value ) {} );
//
//        pidee.on( 'all', function ( domain, value ) {} );
//
//        pidee.set( 'led.yellow', Pidee.ON );
//        pidee.set( 'led.red', Pidee.OFF );
//
//    });
//
//    pidee.on( 'error', function ( err, code, message ) {
//
//    });

// Modules
// =======
var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );
var net = require( 'net' );

// Pidee Class
// ===========
function Pidee () {

    this.socketPath = '/tmp/pidee.sock';

    // State
    var state = {};

    // Flags
    var isOpen = false;
    var hasRequestedInitialData = false;
    var subscribeToken = 0;

    // Self
    var self = this;
    
    // Method: Open
    // ------------
    this.open = function  () {

        // Check not already open
        if ( isOpen ) {
            throw Error( 'Pidee already open' );
        }

        // Create the socket connectio
        var socketClient = net.createConnection( { path: pidee.socketUrl }, function () {
            console.log( 'Pidee Connected' );

            // Make an initial request
            socketClient.write( [ makeToken( self ), 'GET', 'all'  ].join( ' ' ) );
        });

        socketClient.on( 'data', function ( data ) {

            var arr = data.toString( 'ascii' ).split( ' ' );

            // Check the packet is valid
            if ( !getPacketIsValid( arr ) ) {
                return self.trigger( 'error', 'Received invalid packet:' + arr.join( ' ' ) );
            }

            // Check for an error packet
            if ( getPacketIsErrorPacket( arr ) ) {
                var err = new Error( 'Code:' + getPacketErrorCode( arr ) + ' Message: ' + getPacketErrorMessage( arr ) );

                // Throw the error if nobody is listening
                if ( typeof self._events.error === 'undefined' ) {
                    throw err;
                }

                // Trigger error
                return self.trigger( 'error', err, getPacketErrorCode( arr ),  getPacketErrorMessage( arr ) );
            }

            // Set the state
            if ( !getPacketIsDone( arr ) ) {
                state[ getPacketDomain( arr ) ] = getPacketValue( arr );
            }

            // Callback if first request
            if ( !hasRequestedInitialData && getPacketIsDonePacket( arr ) ) {
                
                // Subscribe
                hasRequestedInitialData = true;
                subscribeToken = makeToken( self );
                socketClient.write( [ subscribeToken, 'SUBSCRIBE', 'all'  ].join( ' ' ) );
                // Finsh up
                return;
            }

            // Trigger the domain
            if ( getPacketToken( arr ) === subscribeToken && !getPacketIsDonePacket( arr ) ) {
                self.trigger( getPacketDomain( arr ), getPacketValue( arr ) );
                self.trigger( 'all', getPacketDomain( arr ), getPacketValue( arr ) );
            }
        });

    };
    

    // Method: Get
    // -----------

    this.get = function ( domain ) {
        return state[ domain ];
    };

    // Method: Set
    // -----------
    this.set = function ( domain, value ) {
        socketClient.write( [ makeToken( self ), 'SET', domain, value  ].join( ' ' ) );
    };

}

// Events
// ------
util.inherits( Pidee, EventEmitter );

// Utils
// =====

// Packet
// ------

function getPacketIsDonePacket ( arr ) {
    return arr.length === 2 && arr[ 1 ] === 'DONE';
}

function getPacketIsErrorPacket ( arr ) {
     return arr.length > 1 && ( arr[ 0 ] === 'ERROR' || arr[ 1 ] === 'ERROR' );
}

function getPacketErrorCode ( arr ) {
    return ( arr[ 0 ] === 'ERROR' ) ?  arr[ 1 ] : arr[ 2 ]; 
}

function getPacketErrorMessage ( arr ) {
    return ( arr[ 0 ] === 'ERROR' ) ?  W.rest( arr, 2 ).join( ' ' ) : W.rest( arr, 3 ).join( ' ' ); 
}

function getPacketIsValid ( arr ) {
    if ( arr.length < 2 || arr.length > 4 ) {
        return false;
    }
    if ( arr.length == 2 && arr[ 1 ] === 'DONE' ) {
        return true;
    }
}

function getPacketToken ( arr ) {
    return arr[ 0 ];
}

function getPacketDomain ( arr ) {
    return arr[ 1 ];
}

function getPacketValue ( arr ) {
    return arr[ 2 ];s
}

function makeToken ( pidee ) {
    return '#' + ( ++pidee.tokenCounter );
} 

// Export
// ======
module.exports = Pidee;
