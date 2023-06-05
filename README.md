# Guideline
**1. Structure:**
- .husky: config for husky
- src:
  - app: includes controller and model
  - config: includes db for connecting db and config whatever regarding database
  - middleware:
  - routes: config for routes in server
  - index.js: run main server for handling API
  - authenServer.js: run authentication server
- .env: declare environment variable in here
- .gitignore: ignore file or folder when pushing github

**2. Packages:**
- bcrypt: for encrypting password of user
- cors: config CORS policy
- dotenv: Config environment variable for development or production
- express: server
- jsonwebtoken: used for create json web token
- lint-staged: used for formatting code files in stage of git
- morgan: logger for client call API
- nodemon: config for automating server
- prettier: format code
- husky: used for automatically call lint-staged when committing code

**3. Start server**

Before you code anything, you should pull source code from github

1. Open command line or terminal
2. Run command "npm start" for running main server
3. Run command "npm run startAuthen" for running authentication server
4. Enjoy your code


To format code: Run command "npm run format" for manually formatting code

