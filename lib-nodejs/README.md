Pidee Node.js Module
====================

Requirements
============

`pidee-sevice` needs to be running

Exmaple Usage
=============

```JavaScript

var Pidee = require( 'pidee' );

var pidee = new Pidee();

pidee.on( 'error', function ( err, code, message ) {
    console.log( 'Pidee error:', err );
    console.log( 'Pidee error code:', code );
    console.log( 'Pidee error message:', message );
});

pidee.open( function () {

    // Turn on yellow led
    pidee.set( 'led.yellow', Pidee.ON );

    // Get the dip value
    console.log( 'Pidee dip value is', pidee.get( 'dip' ) );

    // Listen for button presses
    pidee.on( 'button', function ( value ) {
        console.log( 'Button changes', value );
    });

});

```
