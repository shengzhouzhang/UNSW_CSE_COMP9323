#!/bin/bash

cd temp
if test -d $1
then
    echo removing the directory
    rm -fr $1
fi

git clone $2
cd $1
git pull origin master
#git remote add origin "$2"
git checkout -b $3
git push origin $3
