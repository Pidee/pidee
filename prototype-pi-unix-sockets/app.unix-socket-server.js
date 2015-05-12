// Modules
// =======
var net = require( 'net' );
var fs = require( 'fs' );
var W = require( 'w-js' );

// Init
// ====

var init = W.composePromisers( doUnlinkSocketFile, makeServer, bindServer, makeTestClient );

// Make
// ====

init({ socketFilePath: '/tmp/pidee.sock' })
    .success( function () {
        report( 'DONE', 'Created app' );
    })
    .error( function ( err ) {
        report( 'ERROR', 'Failed to create app', err );
    });


function doUnlinkSocketFile ( app ) {
    return W.promise( function ( resolve, reject ) {
        fs.stat( app.socketFilePath, function( err, stat ) {
            if ( !err ) {  
                return fs.unlink( app.socketFilePath, function ( err ) {
                    if ( err ) { return reject( err );  }
                    return resolve( app );
                });
            }
            return resolve( app );
        });
    });
}

function makeServer ( app ) {
    return W.promise( function ( resolve, reject ) {
        app.server = net.createServer( function( client ) {
            report( "CONNECTION", 'New client connection' );
            client.on( 'data', function ( data ) {
                report( 'DATA RECEIVED', data );
            });
        });
        resolve( app );
    });
}

function bindServer ( app ) {
    return W.promise( function ( resolve, reject ) {
        app.server.listen( app.socketFilePath );
        resolve( app );
    });
}

function makeTestClient ( app ) {
    return W.promise( function ( resolve, reject ) {
        var client = net.createConnection( app.socketFilePath, function () {
            report( 'TEST', 'Text client connected to unix socket' );
            client.write( 'hello', function () {
                resolve( app );
            });
        });
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
    return function ( app, done ) {
        report( status, str );
        W.call( done, app );
    };
}
