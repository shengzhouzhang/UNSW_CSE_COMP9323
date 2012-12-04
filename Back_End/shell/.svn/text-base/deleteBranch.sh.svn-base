#!/bin/bash


cd temp
if test -d $1
then
    echo removing the directory
    rm -fr $1
fi

git clone $2
cd $1

if test $3 = "master"
then
    exit 0
fi

git push origin :$3
