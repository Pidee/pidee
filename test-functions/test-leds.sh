#!/bin/bash

# dirty bash script to test dip switches on the pidee

# requires gcc (sudo apt-get install gcc) and wiring-pi (for gpio)
# to install wiring-pi:
# * sudo apt-get install git-core (if you don't already have git)
# * git clone git://git.drogon.net/wiringPi
# * cd wiringPi
# * ./build

# green LED is connected to Pi GPIO header pin 32, which is wiring-pi pin 26
gpio mode 26 out
# red LED is connected to Pi GPIO header pin 33, which is wiring-pi pin 23
gpio mode 23 out
# yellow LED is connected to Pi GPIO header pin 35, which is wiring-pi pin 24
gpio mode 24 out

# cycle through each led from green to yellow, illuminating with a 1-second pause between each step
# make sure we're back to all off when we're done
gpio write 26 1
echo "green"
sleep 1
gpio write 26 0
gpio write 23 1
echo "red"
sleep 1
gpio write 23 0
gpio write 24 1
echo "yellow"
sleep 1
gpio write 24 0