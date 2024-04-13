const { resolve } = require("path");
const db = require("./../db.json");
const fs = require("fs");
const { rejects } = require("assert");
const data = require("./../configs/db");
const { ObjectId } = require("mongodb");

const upgrade = async (userID) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    userCollection.updateOne(
        {_id : new ObjectId(userID)},
        {
            $set : {
                role : "ADMIN"
            }
        }
    );
    return {message : "user has upgraded successfully."}
};

const findByUsername = async (username) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    return userCollection.findOne({username : username})
};

const findByName = async (name) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    return userCollection.findOne({name : name})
};

const login = async (name, username) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    return userCollection.findOne({name : name, username : username})
};

const register = async (newUser) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    userCollection.insertOne(newUser);
    return {message : "New user have registered successfully."}
};

const crime = async (userID, crime) => {
    const db = await data.db();
    const userCollection = db.collection('users');
    userCollection.updateOne(
        {_id : new ObjectId(userID)},
        {
            $inc: {
                crime : crime
            }
        }
    );
    return {message : "crime added."}
};

module.exports = {
    upgrade,
    findByName,
    findByUsername,
    login,
    register,
    crime,
}