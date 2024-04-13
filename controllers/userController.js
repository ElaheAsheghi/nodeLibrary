const userModel = require("./../models/User");
const url = require('url');

const upgradeUser = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const userID = parsedUrl.query.id;

    const upgrade = await userModel.upgrade(userID);
    if(upgrade) {
        res.writeHead(200, {"Content-Type" : "application/json"});
    } else {
        res.writeHead(500, {"Content-Type" : "application/json"});
    }
    res.write(JSON.stringify(upgrade));
    res.end();  
};

const registerUser = (req, res) => {
    let user = "";

    req.on("data", (data) => { //data that have taken in req body
        user = user + data.toString(); //data is in byte and need this method to convert to string
    });
    
    req.on("end", async () => {
        const {name, username} = JSON.parse(user);
        const isUserExist = await userModel.findByUsername(username);
        
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
                name : name,
                username : username,
                crime : 0,
                role : "USER"
            };
            
            const result = await userModel.register(newUser);
            if(result) {
                res.writeHead(201, {"Content-Type" : "application/json"});
            } else {
                res.writeHead(500, {"Content-Type" : "application/json"});
            }
            res.write(JSON.stringify(result));
            res.end();
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

        req.on('end', async () => {
            const {crime} = JSON.parse(reqBody); //bc data is in JSON and we need JS
            
            const add = await userModel.crime(userID, crime);
            if(add) {
                res.writeHead(200, {"Content-Type" : "application/json"});
            } else {
                res.writeHead(500, {"Content-Type" : "application/json"});
            }
            res.write(JSON.stringify(add));
            res.end();  
        });
};

const userLogin = (req, res) => {
    let user = "";

        req.on('data', (data) => {
            user = user + data.toString();
        });

        req.on('end', async () => {
            const {name, username} = JSON.parse(user);

            const authenticate = await userModel.login(name, username);
            
            if(authenticate) {
                res.writeHead(200, {"Content-Type" : "application/json"});
                res.write(JSON.stringify({message : "login was successfull."}));
            } else {
                res.writeHead(401, {"Content-Type" : "application/json"});
                res.write(JSON.stringify({message : "user not found!"}));
            };
            res.end();
        });
}

module.exports = {
    upgradeUser,
    registerUser,
    addCrime,
    userLogin,
}