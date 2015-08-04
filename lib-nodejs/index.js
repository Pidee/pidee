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

    this.socketUrl = '/tmp/pidee.sock';

    var socketClient;
    
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
    this.open = function  ( callback ) {

        // Check not already open
        if ( isOpen ) {
            throw Error( 'Pidee already open' );
        }

        // Create the socket connectio
        socketClient = net.createConnection( { path: self.socketUrl }, function () {
            console.log( 'Pidee Connected' );

            // Make an initial request
            socketClient.write( [ makeToken( self ), 'all', 'GET'  ].join( ' ' ) );
        });

        socketClient.on( 'data', doForEachLine( function ( dataStr ) {

            var arr = dataStr.split( ' ' );

            // Check the packet is valid
            if ( !getPacketIsValid( arr ) ) {
                return self.emit( 'error', 'Received invalid packet: >>' + arr.join( ' ' ) + '<<' );
            }

            // Check for an error packet
            if ( getPacketIsErrorPacket( arr ) ) {
                var err = new Error( 'Code:' + getPacketErrorCode( arr ) + ' Message: ' + getPacketErrorMessage( arr ) );

                // Throw the error if nobody is listening
                if ( typeof self._events.error === 'undefined' ) {
                    throw err;
                }

                // Trigger error
                return self.emit( 'error', err, getPacketErrorCode( arr ),  getPacketErrorMessage( arr ) );
            }

            // Set the state
            if ( !getPacketIsDonePacket( arr ) ) {
                state[ getPacketDomain( arr ) ] = getPacketValue( arr );
            }

            // Callback if first request
            if ( !hasRequestedInitialData && getPacketIsDonePacket( arr ) ) {
                
                // Subscribe
                hasRequestedInitialData = true;
                subscribeToken = makeToken( self );
                socketClient.write( [ subscribeToken, 'all', 'SUBSCRIBE'  ].join( ' ' ) );
                if ( typeof callback === 'function' ) {
                    callback();
                }
                // Finsh up
                return;
            }

            // Trigger the domain
            if ( getPacketToken( arr ) === subscribeToken && !getPacketIsDonePacket( arr ) ) {
                self.emit( getPacketDomain( arr ), getPacketValue( arr ) );
                self.emit( 'all', getPacketDomain( arr ), getPacketValue( arr ) );
            }
        }));

    };
    

    // Method: Get
    // -----------

    this.get = function ( domain ) {
        return state[ domain ];
    };

    // Method: Set
    // -----------
    this.set = function ( domain, value ) {
        socketClient.write( [ makeToken( self ), domain, 'SET', value  ].join( ' ' ) );
    };

}

// Events
// ------
util.inherits( Pidee, EventEmitter );

Pidee.subscribeTokenCounter = 0;
Pidee.ON = 1;
Pidee.OFF = 0;

// Utils
// =====

// Function
// --------
function  doForEachLine( fn ) {
    return function ( data ) {
        data.toString( 'ascii' ).split( '\n' ).filter( function ( line ) { return line !== ''; } ).forEach( fn );
    };
}

// Array
// -----

function rest ( arr, n ) {
    return arr.splice( n || 1 );
}

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
    return ( arr[ 0 ] === 'ERROR' ) ?  rest( arr, 2 ).join( ' ' ) : rest( arr, 3 ).join( ' ' ); 
}

function getPacketIsValid ( arr ) {
    if ( arr.length < 2 ) {
        return false;
    }
    if ( arr.length > 4 && ( arr[ 0 ] === 'ERROR' || arr[ 1 ] ==='ERROR' ) ) {
        return true;
    }
    if ( arr.length == 2 && arr[ 1 ] === 'DONE' ) {
        return true;
    }
    return true;
}

function getPacketToken ( arr ) {
    return arr[ 0 ];
}

function getPacketDomain ( arr ) {
    return arr[ 1 ];
}

function getPacketValue ( arr ) {
    return arr[ 2 ];
}

function makeToken ( pidee ) {
    return '#' + ( ++Pidee.subscribeTokenCounter );
} 

// Export
// ======
module.exports = Pidee;
