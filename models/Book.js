//this file is for all logics on book data.
const { resolve } = require("path");
const db = require("./../db.json");
const fs = require("fs");
const data = require("./../configs/db");
const { ObjectId } = require("mongodb");

const getBook = async () => {
    const db = await data.db();
    const bookCollection = db.collection("books");
    const books = bookCollection.find({}).toArray();
    return books;
};

const remove = async (bookID) => {
    let deleted = false
    const db = await data.db();
    const bookCollection = db.collection('books');
    const result = bookCollection.deleteOne({_id : new ObjectId(bookID)}); 

    if((await result).deletedCount) {
        deleted = true
        return {message: "Removed successfully"};
    } else {
        return {message: "Not found!"};
    };
};

const add = async (newBook) => {
    let added = false
    const db = await data.db();
    const bookCollection = db.collection('books');
    const addToDb = bookCollection.insertOne(newBook); //add this newBook to database
        if(addToDb) {
            added = true
            return {message : "New book added successfully"};  
        } else {
            return {message : "server error"};
        }
};

const giveBack = async (bookID) => {
    let done = false;
    const db = await data.db();
    const bookCollection = db.collection('books');
    const book = bookCollection.updateOne({_id : new ObjectId(bookID)},
    {
        $set : {
            free : 1
        }
    });
      
    if(book) {
        done = true;
        return {message : "successfull"}
    }
};

const edit = async (bookID, reqBody) => {
    const db = await data.db();
    const bookCollection = db.collection('books');
    bookCollection.updateOne(
        {_id : new ObjectId(bookID)},
        {
            $set : {
                title : reqBody.title,
                author : reqBody.author,
                price : reqBody.price
            }
        });
       
        return {message : "Book data have changed successfully."}
};

const isFree = async (bookID) => {
    const db = await data.db();
    const bookCollection = db.collection('books');
    const book = bookCollection.find(
        {
            _id : new ObjectId,
            free : 1
        });
    return book
};

const rent = async (bookID, newRent) => {
    const db = await data.db();
    const rentCollection = db.collection('rents');
    const bookCollection = db.collection('books');
    await bookCollection.updateOne(
        {_id : new ObjectId(bookID)},
        {
            $set : {
                free : 0
            }
        }
    );
    
    const rent = await rentCollection.insertOne(newRent);
    if(rent) {
        return {message : "Book reserved successfully."};
    } else {
        return {message : "couldnt reserve this book."};
    };
};


module.exports = {
    getBook,
    remove,
    add,
    giveBack,
    edit,
    isFree,
    rent,
};