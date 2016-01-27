#!/bin/bash
#
# author: Rafael Campos NUnes
# date: 05/12/2015 (DD/MM/YYYY)
#

NODE_JS=`which node`

if [ -z $NODE_JS ] 
then
	echo "O programa nodejs não pôde ser encontrado, certifique-se de que o softwware necessário está instalado."
else
	$NODE_JS app.js $@
fi