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

const giveBack = (bookID) => {
    return new Promise((resolve, reject) => {
        db.books.forEach((book) => {
            if(book.id === Number(bookID)) {
                book.free = 1;
            }
        });

        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve({message : "successfull"})
            }
            
        });
    });
};

const edit = (bookID, reqBody) => {
    return new Promise((resolve, reject) => {
        db.books.forEach((book) => {
            if(book.id === Number(bookID)) {
                book.title = reqBody.title;
                book.author = reqBody.author;
                book.price = reqBody.price;
            }
        });
    
        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve({message : "Book data have changed successfully."})
            }
        });
            
    });
};

const isFree = (bookID) => {
    return db.books.find((book) => book.id === Number(bookID) && book.free === 1);
};

const rent = (bookID, newRent) => {
    return new Promise((resolve, reject) => {
        db.books.forEach((book) => {
            if(book.id === Number(bookID)) {
                book.free = 0;
            }
        });
        db.rent.push(newRent);
    
        fs.writeFile("./db.json", JSON.stringify(db, null, 4), (err) => {
            if(err) {
                reject(err);
            } else {
                resolve({message : "Book reserved successfully."})
            }
        });
    });
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