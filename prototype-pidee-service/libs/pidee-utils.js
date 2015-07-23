// Pidee Utils
// ===========

// Modules
// =======
var W = require( 'w-js' );
var exec = require('child_process').exec;

// Reporting
// =========
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

// Promisers
// ---------

function promiseWrap( fn ) {
    return function () {
        var args = arguments;
        return W.promise( function ( resolve, reject ) {
            try {
                fn();
            } catch ( err )  {
                return reject( err );
            }
            resolve.apply( this, args );
        });
    };
}

// Export
// ======
module.exports = {
    makeReporter: makeReporter,
    report: report,
    promiseWrap: promiseWrap
};
