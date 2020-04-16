# Zendesk Product Security
### The Zendesk Product Security Challenge

Hello friend,

We are super excited that you want to be part of the Product Security team at Zendesk.

**To get started, you need to fork this repository to your own Github profile and work off that copy.**

In this repository, there are the following files:
1. README.md - this file
2. project/ - the folder containing all the files that you require to get started
3. project/index.html - the main HTML file containing the login form
4. project/assets/ - the folder containing supporting assets such as images, JavaScript files, Cascading Style Sheets, etc. You shouldn’t need to make any changes to these but you are free to do so if you feel it might help your submission

As part of the challenge, you need to implement an authentication mechanism with as many of the following features as possible. It is a non exhaustive list, so feel free to add or remove any of it as deemed necessary.

1. [x] Input sanitization and validation
2. [x] Password hashed
3. [x] Prevention of timing attacks **Technically, bcrypt has non-constant time for comparisons. Thus, without the salt, it would be hard to get information out.**
4. [x] Logging
5. [ ] CSRF prevention
6. [ ] Multi factor authentication
7. [ ] Password reset / forget password mechanism
8. [ ] Account lockout
9. [x] Cookie
10. [x] HTTPS
11. [ ]Known password check

You will have to create a simple binary (platform of your choice) to provide any server side functionality you may require. Please document steps to run the application. Your submission should be a link to your Github repository which you've already forked earlier together with the source code and binaries.

Thank you!

## Installation
Execute `npm i && npm run start`. This installs the necessary node modules and then uses nodemon to start. Any changes in code will trigger nodemon to restart the server for the sake of development.