const url = require("url");
const BookModel = require("./../models/Book");

const getAll = async (req, res) => { //bc communicte with database is an async func, so define this func with async.
    const books = await BookModel.getBook(); //bc model should communicate with db. and use await bc giving data from database is an async func.
  
    res.writeHead(200, { "Content-Type" : "application/json"});
    res.write(JSON.stringify(books));
    res.end();
};

const removeBook = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookID = parsedUrl.query.id;

    const removedBook = await BookModel.remove(bookID)
    .then((value) => {
        res.writeHead(200, { "Content-Type" : "application/json"});
        res.write(JSON.stringify(value));
        res.end();
    })
    .catch((value) => {
        res.writeHead(404, { "Content-Type" : "application/json"});
        res.write(JSON.stringify(value));
        res.end();
    });
    
};

const addNewBook = (req, res) => {
    let book = ""; //its var for adding data to it after get data from req body
        req.on('data', (data) => { //its a event with 'data' name. make event with on(). get data in callback func.
            book = book + data.toString(); 
        });
        req.on('end', () => { //write a event for ending this req(compelete this req successfully)
            console.log(JSON.parse(book));
            const newBook = {id : crypto.randomUUID(), ...JSON.parse(book), free :  1}; //datas that recieved from client are added to this obj with spread syntax ...book

            const addNew = BookModel.add(newBook)
                .then((value) => {
                    res.writeHead(201, {"Content-Type" : "application/json"}); //201 status for create something successfully
                    res.write(JSON.stringify(value));
                    res.end();
                }).catch((value) => {
                    res.writeHead(500, {"Content-Type" : "application/json"});
                    res.write(JSON.stringify(value));
                    res.end();
                });
        });
};

const giveBackBook = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookID = parsedUrl.query.id;

    const returnedBook = BookModel.giveBack(bookID)
        .then((value) => {
            res.writeHead(200, {"Content-Type" : "application/json"});
            res.write(JSON.stringify(value));
            res.end();
        })
        .catch((value) => {
            res.writeHead(404, {"Content-Type" : "application/json"});
            res.write(JSON.stringify(value));
            res.end();
        });
};

const editBook = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookID = parsedUrl.query.id;
    let bookNewInfos = "";
        req.on("data", (data) => {
            bookNewInfos = bookNewInfos + data.toString();
        });
        req.on("end", () => {
            const reqBody = JSON.parse(bookNewInfos);
                BookModel.edit(bookID, reqBody)
                .then((value) => {
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

const rentBook = (req, res) => {
    let reqBody = "";

        req.on('data', (data) => {
            reqBody = reqBody + data.toString();
        });

        req.on('end', () => {
            let {userID, bookID} = JSON.parse(reqBody);

            const isFreeBook = BookModel.isFree(bookID);

            if(isFreeBook) {
                const newRent = {
                    id : crypto.randomUUID(),
                    userID,
                    bookID
                };
                BookModel.rent(bookID, newRent).then((value) => {
                    res.writeHead(201, {"Content-Type" : "application/json"});
                    res.write(JSON.stringify(value))
                    res.end();
                }).catch((value) => {
                    res.writeHead(500, {"Content-Type" : "application/json"});
                    res.write(JSON.stringify(value))
                    res.end();
                })
            } else {
                res.writeHead(401, {"Content-Type" : "application/json"});
                res.write(JSON.stringify({message : "This book is not free."}));
                res.end();
            };
        });
}

module.exports = {
    getAll,
    removeBook,
    addNewBook,
    giveBackBook,
    editBook,
    rentBook,
};