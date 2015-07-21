#!/bin/bash

# dirty bash script to test dip switches on the pidee

# requires gcc (sudo apt-get install gcc) and wiring-pi (for gpio)
# to install wiring-pi:
# * sudo apt-get install git-core (if you don't already have git)
# * git clone git://git.drogon.net/wiringPi
# * cd wiringPi
# * ./build

# switch 1 is connected to Pi GPIO header pin 31, which is wiring-pi pin 22
gpio mode 22 up
# switch 2 is connected to Pi GPIO header pin 29, which is wiring-pi pin 21
gpio mode 21 up
# switch 3 is connected to Pi GPIO header pin 22, which is wiring-pi pin 6
gpio mode 6 up
# switch 4 is connected to Pi GPIO header pin 18, which is wiring-pi pin 5
gpio mode 5 up
# switch 5 is connected to Pi GPIO header pin 16, which is wiring-pi pin 4
gpio mode 4 up
# switch 6 is connected to Pi GPIO header pin 15, which is wiring-pi pin 3
gpio mode 3 up
# switch 7 is connected to Pi GPIO header pin 13, which is wiring-pi pin 2
gpio mode 2 up
# switch 8 is connected to Pi GPIO header pin 11, which is wiring-pi pin 0
gpio mode 0 up

# output switch values serially to the console - remember switches are active low
gpio read 22
gpio read 21
gpio read 6
gpio read 5
gpio read 4
gpio read 3
gpio read 2
gpio read 0