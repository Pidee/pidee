#!/bin/bash

id -u pidee &>/dev/null || useradd pidee 
getent group pidee || groupadd pidee
