#!/bin/bash

cd temp
cd $1

git checkout $3

path=$2
while true
do
    name=`echo $path | cut -d'/' -f1`
    path=`echo $path | cut -d'/' -f2-`
    if test $name = $path
    then
        break
    else
        if test -d $name
        then
            cd $name
        else
            mkdir $name
            cd $name
        fi
    fi
done
