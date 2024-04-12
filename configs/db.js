require("dotenv").config();
const {MongoClient, ObjectId} = require("mongodb");
const url = "mongodb://localhost:27017/";
const dbConnection = new MongoClient(url);
const dbName = process.env.dbName;

const db = async () => {
            await dbConnection.connect();
            console.log("Connected to database successfully!");
    
            const db = dbConnection.db(dbName);
            return db;
};

module.exports = {
    db
}


