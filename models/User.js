const { resolve } = require("path");
const db = require("./../db.json");
const fs = require("fs");
const { rejects } = require("assert");

const upgrade = (userID) => {
    return new Promise((resolve, reject) => {
        db.users.forEach((user) => {
            if(user.id === Number(userID)){
                user.role = "ADMIN";
            }
        });
            
        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve({message : "user upgraded successfully"})
            };
        });
    });
};

const findByUsername = (username) => {
    return db.users.find((user) => user.username === username);
};

const findByName = (name) => {
    return db.users.find((user) => user.name === name);
};

const login = (name, username) => {
    return db.users.find((user) => user.name === name && user.username === username);
};

const register = (newUser) => {
    return new Promise((resolve, reject) => {
        db.users.push(newUser);

        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve("New user have registered successfully.")
            };
        });
    });
};

const crime = (userID, crime) => {
    return new Promise((resolve, reject) => {
        db.users.forEach((user) => {
            if(user.id === Number(userID)) { //bc userID is string type
                user.crime = user.crime + crime;
            }
        });
        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve({message : "crime added."})
            };
        });
    });
};

module.exports = {
    upgrade,
    findByName,
    findByUsername,
    login,
    register,
    crime,
}