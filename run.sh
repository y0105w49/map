#!/bin/sh

export PATH=/usr/local/bin:$PATH

forever stop main.js

export OUTLOG=./logs/node-log.txt
export ERRLOG=./logs/node-error-log.txt
export FOREVERLOG=./logs/forever-log.txt
export HOSTNAME=map.amolina.ca
export PORT=7003

forever --minUptime 5000 --spinSleepTime 2000 -a -o $OUTLOG -e $ERRLOG start main.js >> $FOREVERLOG 2>&1
