Pidee Node.js Module
====================

Requirements
============

`pidee-service` needs to be installed and running on the Raspberry Pi. To install and run `pidee-service` ssh into your Raspberry Pi and run the following commands:

```Bash
sudo echo "deb http://pidee.theworkers.net/raspbian wheezy main" >> /etc/apt/sources.list
wget -qO - http://pidee.theworkers.net/pidee.public.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install pidee
```

How to use
==========

`npm install pidee`

Adds the node pidee module from npm to your project.


API
===

###  pidee.on( domain, callback )
Listen for pidee change events. The domain can be: `'dip'`, `'button'`, `'dip.1'`, `'dip.2'`. See domains below for a full list.

Example:  
```
pidee.on( 'bottom', function ( value ) {
    // Button has changed
});
```

### pidee.get( domain )
Returns a value on the pidee board. The domain can be: `'dip'`, `'button'`, `'dip.1'`, `'dip.2'` etc. See domains below for a full list.

Example:  
`var value = pidee.get( 'dip.1' ) // return 0 or 1`

### pidee.set( domain, value )
Sets the value of the leds. The domain can be: `'led.yellow'`, `'led.green'`, `'led.blue'`. See domains below for a full list.

Example:  
`var value = pidee.get( 'led.yellow', true );

### pidee.on( 'error', callback )
Listen to error events. The callback function should be in the form: `function ( err, errorCode, message )`

Example:
```
pidee.on( 'error', function ( err, errorCode, message ) {
    console.log( 'Pidee error:', err );
    console.log( 'Pidee error code:', code );
    console.log( 'Pidee error message:', message );
});
```


Example
=======

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
    var value = pidee.get( 'dip' );

    // Listen for button presses
    pidee.on( 'button', function ( value ) {
        console.log( 'Button changes', value );
    });

});
```

Domains
=======

| Domain          | Value Range | 
|-----------------|:-----------:|
| _all_           |             |
| __led__         | [0,7]       |
| __led.yellow__  | [0,1]       |
| __led.green__   | [0,1]       |
| __led.red__     | [0,1]       |
| __dip__         | [0,255]     |
| __dip.0__       | [0,1]       |
| __dip.1__       | [0,1]       |
| __dip.2__       | [0,1]       |
| __dip.3__       | [0,1]       |
| __dip.4__       | [0,1]       |
| __dip.5__       | [0,1]       |
| __dip.6__       | [0,1]       |
| __dip.7__       | [0,1]       |
| __button__      | [0,1]       |

| Domain  | GET      | SET      | ON            |
|---------|:--------:|:--------:|:-------------:|
| led     |          | &#x2713; |               | 
| dip     | &#x2713; |          | &#x2713;      | 
| button  | &#x2713; |          | &#x2713;      | 
| _all_   | &#x2713; |          | &#x2713;      | 
