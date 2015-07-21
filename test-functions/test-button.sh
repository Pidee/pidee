#!/bin/bash

# dirty bash script to test push button on the pidee

# requires gcc (sudo apt-get install gcc) and wiring-pi (for gpio)
# to install wiring-pi:
# * sudo apt-get install git-core (if you don't already have git)
# * git clone git://git.drogon.net/wiringPi
# * cd wiringPi
# * ./build

# push button is on Pi GPIO header pin 12, which is wiring-pi pin 1
gpio mode 1 up
# this outputs the read value to the console - remember the switch is active low
gpio read 1