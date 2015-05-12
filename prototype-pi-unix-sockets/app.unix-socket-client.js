// Modules
// =======
var net = require( 'net' );
var fs = require( 'fs' );
var W = require( 'w-js' );

// Init
// ====

var init = W.composePromisers( makeClient, makeReporter( 'DOME', 'App created' ) );

// Make
// ====

init({ socketFilePath: '/tmp/pidee.sock' })
    .error( function ( err ) {
        report( 'ERROR', 'Failed to create app.', err );
    });

function makeClient ( app ) {
    return W.promise( function ( resolve, reject ) {
        var client = net.createConnection( app.socketFilePath, function () {
            report( 'CONNECTION CREATED', 'Text client connected to unix socket' );
            client.write( 'hello from servers test client', function () {
                resolve( app );
            });
        });
        client.on( 'error', reject );
    });
}

// Utils
// =====

// Reporting
// ---------
function report( status, str ) {
    console.log( '[', status, ']', W.rest( W.toArray( arguments ) ).join( ' ' ) );
}

function makeReporter( status, str ) {
    var reportArgs = arguments;
    return function () {
        report.apply( this, reportArgs );
        var calleeArgs = arguments;
        return W.promise( function ( resolve, reject ) {
            resolve.apply( this, calleeArgs );
        });
    };
}
