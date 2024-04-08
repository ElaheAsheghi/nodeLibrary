//this file is for all logics on book data.
const { resolve } = require("path");
const db = require("./../db.json");
const fs = require("fs");

const getBook = () => { //read file is an async func so we need promise.
    return new Promise((resolve, reject) => {
        resolve(db.books);
    });
};

const remove = (bookID) => {
    return new Promise((resolve, reject) => {
        const newBooks = db.books.filter((book) => book.id != Number(bookID));
        
        if(db.books.length === newBooks.length){
            reject({message : "Not found this book!"});
        } else {
            fs.writeFile(`${process.cwd()}/db.json`, JSON.stringify({...db, books:newBooks}, null, 2), (err) => {
                if(err) {
                    reject(err);
                }
                resolve({message : "Removed successfully!"});
            });
        };
    });
};

const add = (newBook) => {
    return new Promise((resolve, reject) => {
        db.books.push(newBook); //add this newBook to database
            
            fs.writeFile("db.json", JSON.stringify(db, null, 4), (err) => { //save this database with newbook
                if(err) {
                    reject(err);
                } else {
                    resolve({message : "New book added successfully"});
                }

            });
    });
            
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