const userModel = require("./../models/User");
const url = require('url');

const upgradeUser = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const userID = parsedUrl.query.id;

    userModel.upgrade(userID).then((value) => {
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.write(JSON.stringify(value));
        res.end();
    }).catch((value) => {
        res.writeHead(500, {"Content-Type" : "application/json"});
        res.write(JSON.stringify(value));
        res.end();
    });
};

const registerUser = (req, res) => {
    let user = "";

    req.on("data", (data) => { //data that have taken in req body
        user = user + data.toString(); //data is in byte and need this method to convert to string
    });
    
    req.on("end", () => {
        const {name, username} = JSON.parse(user);
        const isUserExist = userModel.find(username);
        
        if(name === "" || username === "") {
            res.writeHead(422, {"Content-Type" : "application/json"});
            res.write(JSON.stringify({message : "name or username can not be empty."}))
            res.end();
        } else if(isUserExist) {
            res.writeHead(409, {"Content-Type" : "application/json"});
            res.write(JSON.stringify({message : "name or username already exist."}));
            res.end();
        } else {
            const newUser = {
                id : crypto.randomUUID(),
                name : name,
                username : username,
                crime : 0,
                role : "USER"
            };
            
            userModel.register(newUser).then((value) => {
                res.writeHead(201, {"Content-Type" : "application/json"});
                res.write(JSON.stringify(value));
                res.end();
            }).catch((value) => {
                res.writeHead(500, {"Content-Type" : "application/json"});
                res.write(JSON.stringify(value));
                res.end();
            })
            
        };
    });
};

const addCrime = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
        const userID = parsedUrl.query.id;
        let reqBody = "";

        req.on('data', (data) => {
            reqBody = reqBody + data.toString(); //bc data is in binary lang
        });

        req.on('end', () => {
            const {crime} = JSON.parse(reqBody); //bc data is in JSON and we need JS
            
            userModel.crime(userID, crime).then((value) => {
                res.writeHead(200, {"Content-Type" : "application/json"});
                res.write(JSON.stringify(value));
                res.end();
            }).catch((value) => {
                res.writeHead(500, {"Content-Type" : "application/json"});
                res.write(JSON.stringify(value));
                res.end();
            });
        });
};

const userLogin = (req, res) => {
    let user = "";

        req.on('data', (data) => {
            user = user + data.toString();
        });

        req.on('end', () => {
            const {name, username} = JSON.parse(user);

            const authenticate = userModel.login(name, username);
            
            if(authenticate) {
                res.writeHead(200, {"Content-Type" : "application/json"});
                res.write(JSON.stringify({message : "login was successfull."}));
                res.end();
            } else {
                res.writeHead(401, {"Content-Type" : "application/json"});
                res.write(JSON.stringify({message : "user not found!"}));
                res.end();
            };
        });
}

module.exports = {
    upgradeUser,
    registerUser,
    addCrime,
    userLogin,
}