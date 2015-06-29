// Pidee Utils
// ===========

// Modules
// =======
var W = require( 'w-js' );
var exec = require('child_process').exec;

// Privilages
// ==========

function isSuperUser () {
    return process.getuid() === 0;
}

function dropSuperUserPrivilages () {
    if ( !process.env.SUDO_USER ) {
        throw new Error( 'Unable to get non-sudo user' );
    }
    process.setuid( process.env.SUDO_USER );
}

function getUIDFromUsername ( username, callback ) {
    if (typeof username === 'function') {
        callback = username;
        username = undefined;
    }
    username = username || 'pidee';
    callback = callback || function () {};

    var child = exec('id -u ' + username, {uid: 501}, function ( err, stdout, stderr ) {
        if ( err ) {
            return callback( err );
        }
        callback( null, stdout );
    });
}

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

function getUIDFromUsernamePromise ( username ) {
    username = username || 'pidee';
    var args = arguments;
    return W.promise( function ( resolve, reject ) {
        getUIDFromUsername( username, function (err, stdout) {
            if ( err ) {
                return reject( err );
            }
            resolve.apply( this, args );
        });
    });
}

function confirmSuperUserPromise () {
    var args = arguments;
    return W.promise( function ( resolve, reject ) {
        if ( isSuperUser() ) {
            resolve.apply( this, args );
        } else {
            reject( new Error( 'Needs to be run as root. Try running with sudo' ) );
        }
    });
}

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
    isSuperUser: isSuperUser,
    dropSuperUserPrivilages: dropSuperUserPrivilages,
    confirmSuperUserPromise: confirmSuperUserPromise,
    getUIDFromUsernamePromise: getUIDFromUsernamePromise,
    makeReporter: makeReporter,
    report: report,
    promiseWrap: promiseWrap
};
