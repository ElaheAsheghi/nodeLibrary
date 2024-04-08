const {MongoClient} = require("mongodb");
const url = "mongodb://localhost:27017/";
const dbConnection = new MongoClient(url);
const dbName = "library";
const main = async () => {
    await dbConnection.connect();
    const db = dbConnection.db(dbName);
    const userCollection = db.collection("users");
    userCollection.insertOne({"name" : "Elahe"});
};

main();