#!/usr/bin/env bash
if [ -z "$(composer global show | grep pragmarx/laravelcs)" ]
then
	composer global require pragmarx/laravelcs
fi

printf "\n=== RUNNING SERVER VALIDATION ==="
cd server
exit_status=0

server_errors=$(phpcs --standard=PSR2 app/)
if [ "$?" != "0" ]; then
	printf "$server_errors"
	exit_status=1
fi

printf "\n=== RUNNING WEBAPP VALIDATION ===\n\n"
cd ../webapp
npm install --only=dev

webapp_errors=$(./node_modules/.bin/eslint ./client)
if [ "$?" != "0" ]; then
	printf "$webapp_errors"
	exit_status=1
fi

exit $exit_status