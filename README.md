Project Overview:

A text analyzer tool.

Setup:

1. run "yarn install"
2. create '.env' using '.env.example'
3. setup and create mysql database and set DB_NAME
4. create mysql database for testing and set DB_NAME_TEST (assuming both main db and test db is sharing same mysql
   credentials)

Compile & run the project:

1. run "yarn start"

Run tests

1. run "yarn test" (use "yarn win:test" for windows platform)

Important Notes:

1. visit http://localhost:PORT for UI.
2. Google Oauth2 is implemented for both web and API endpoints. visit
   http://localhost:PORT/auth/google/api for Oauth2
   flow and get accessToken for Api token. Otherwise API endpoint will show 401 Unauthorized error.
3. Configure Google Oauth and get client ID and client secret. Set callback url as
   http://localhost:PORT/auth/google/callback