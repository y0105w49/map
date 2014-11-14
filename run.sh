#!/bin/sh

export PATH=/usr/local/bin:$PATH

forever stop main.js

OUTLOG=./logs/node-log.txt
ERRLOG=./logs/node-error-log.txt
FOREVERLOG=./logs/forever-log.txt
HOSTNAME=map.amolina.ca
PORT=7002

forever --minUptime 5000 --spinSleepTime 2000 -a -o $OUTLOG -e $ERRLOG start main.js >> $FOREVERLOG 2>&1
