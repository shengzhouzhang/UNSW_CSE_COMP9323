#!/bin/bash

echo removing...
echo "Hello" >README.md
git init
git add README.md
git commit -m "My initial commit message"
git remote add origin "$1"
git push -u origin master
rm -fr .git
