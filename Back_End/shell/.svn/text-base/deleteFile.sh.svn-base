#!/bin/sh

cd temp
cd $1

git checkout $2

rm -fr $3

git add *
git commit -a -m "$4"
git push
