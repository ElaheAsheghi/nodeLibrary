const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('./db.json');
const { stringify } = require('querystring');
const bookController = require('./controllers/bookController');
const userController = require('./controllers/userController');

const server = http.createServer( (req, res) => {
    if(req.method === 'GET' && req.url === "/api/users") { //see all users list
        fs.readFile("db.json", (err, db) => {
            if(err) {
                throw err;
            }
            const data = JSON.parse(db);

            res.writeHead(200, {"Content-Type" : "application/json"});
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if(req.method === "GET" && req.url === "/api/books") { //see all books list
        bookController.getAll(req, res);
    } else if(req.method === "DELETE" && req.url.startsWith('/api/books')) { //delete book from lib
        bookController.removeBook(req, res);
    } else if(req.method === "POST" && req.url === '/api/books') {  //add new book to lib
        bookController.addNewBook(req, res);
    } else if(req.method === "PUT" && req.url.startsWith('/api/books/back')) { //give back book to lib
        bookController.giveBackBook(req, res);
    } else if(req.method === "PUT" && req.url.startsWith('/api/books')) { //its a api for edit book properties.clear book id in url and new values in req body
        bookController.editBook(req, res);
    } else if (req.method === "PUT" && req.url.startsWith('/api/users/upgrade')) { //api for upgrade USER role to ADMIN role
        userController.upgradeUser(req, res);
    } else if(req.method === "POST" && req.url === '/api/users') { //api for registering new user
       userController.registerUser(req, res);
    } else if(req.method === "PUT" && req.url.startsWith('/api/users')) { //api for add crime to user. bc we are getting data in req body, we need req.on()
        userController.addCrime(req, res);
    } else if(req.method === "POST" && req.url === '/api/users/login') { //login user
        userController.userLogin(req, res);
    } else if(req.method === "POST" && req.url === '/api/books/rent') { //rent book from lib
        bookController.rentBook(req, res);
    }
});

server.listen(4000, () => {
    console.log("server is running!");
});