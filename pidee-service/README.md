# Pidee Service

- [Getting Started with Pidee Service](#getting-started-with-pidee-service)
    - [Examples](#examples)
- [Developers](#developers-how-to-communicate-with-pidee-service-)
- [Using Pidee Board without Pidee Service](#using-pidee-board-without-pidee-service)

## Getting started with Pidee Service

You can likely skip step one if pidee has been install via the package manager.

1. Run **pidee-service** with `sudo bin/pidee-service`
2. In another terminal session, try running **pidee-cli** by `cd`ing into your Pidee folder, then the `pidee-service` folder and then run `bin/pidee-cli` 

## Examples

Run the following examples from the `pidee/bin` folder (with `cd bin`)

##### Turn on the yellow LED

`./pidee-cli set led.yellow 1`

##### Turn off the yellow LED

`./pidee-cli set led.yellow 0`

#### Get the value of the dip switches

`./pidee-cli get dip`

_Voilà! You have id'ed the pi the with a Pidee!_

#### Get the value of the third dip switch

`./pidee-cli get dip.2`

#### See if the button is pressed

`./pidee-cli get button`

#### Get all switches and button values

`./pidee-cli get all`

#### Set all the LEDs to off

`./pidee-cli set led 0`

#### Set all the LEDs on

`./pidee-cli set led 0`

_Intrigued? You can set the three LEDs at once using a binary bitmask_

#### Listen for the button to be pressed or lifted

`./pidee-cli subscribe button`

*Push `Ctrl-C` to quit it*

#### Listen for the dip switch to change

`./pidee-cli subscribe dip`

#### Listen for the 6th dip switch to change

`./pidee-cli subscribe dip.6`

#### Listen any changes to the dip or the switch

`./pidee-cli subscribe all`

## Developers (How to communicate with pidee-service )

In the examples above `pidee-cli` sends commands to the pidee service via a unix socket files. Check the [Protocol Document](Protocol.md) for more info on how the commands are structures. If you want to test the protocol you can do so in the terminal. Here is an example:

```
echo "#foo led.yellow SET 1" | nc -U /tmp/pidee.sock
```

The command, which is defined in the protocol documents, is `#foo led.yellow SET 1`. `nc` is a utility to write to the socket. Most programming languages will give you a way to do this.


# Using Pidee Board without Pidee Service 

Of course, you can ditch pidee-service all together and just use the GPIO on the rasppbery pi directly. Checkout the schmantic for the board [here](../pcb/export/drawings/Pidee%20Schematic.pdf) and [wiring-pi](http://wiring-pi.com/) to interface with the GPIO.




