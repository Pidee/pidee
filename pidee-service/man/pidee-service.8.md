PIDEE SERVICE 8
===============

NAME
----

pidee-service - System deamon for the Pidee Raspberry Pi add-on board.

SYNOPSIS
--------

`pidee` [`options`] [`command`]

DESCRIPTION
-----------

`pidee` 

OPTIONS
-------

`-h, --help`
  Output usage information

`-V, --version`
  Output version information

COMMANDS
--------

`set` [`color`] [`value`]
  set LED (red|yellow|green) to between 0 - 1

`dip`
  reads all DIP switch values as an integer value

`switch` [`switch-number`]
  reads a switch value as either 0 or 1

FILES
-----

*/etc/pidee.conf*
  The system wide configuration file.  

*~/.pideerc*
  Per user configuration file. See pidee-service(8) for further details.

ENVIRONMENT
-----------

`PIDEE_SOMETHING`
  If non-null the full pathname for an alternate system wide */etc/foo.conf*.  
  Overridden by the `-c` option.

DIAGNOSTICS
-----------

The following diagnostics may be issued on stderr:

**Some heading**
  `pidee` can only handle pies.

BUGS
----

None known.

AUTHOR
------

The Workers <pidee@theworkers.net>

SEE ALSO
--------

pidee(1), [Pidee website](http://pidee.org)
