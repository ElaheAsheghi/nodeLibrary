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
    if(removedBook.deleted) {
        res.writeHead(200, { "Content-Type" : "application/json"});
    } else {
        res.writeHead(404, { "Content-Type" : "application/json"});
    }
    res.write(JSON.stringify(removedBook));     
    res.end();
};

const addNewBook = (req, res) => {
    let book = ""; //its var for adding data to it after get data from req body
        req.on('data', (data) => { //its a event with 'data' name. make event with on(). get data in callback func.
            book = book + data.toString(); 
        });
        req.on('end', async () => { //write a event for ending this req(compelete this req successfully)
            console.log(JSON.parse(book));
            const newBook = {...JSON.parse(book)}; //datas that recieved from client are added to this obj with spread syntax ...book

            const addNew = await BookModel.add(newBook)
                if(addNew.added) {
                    res.writeHead(201, {"Content-Type" : "application/json"}); //201 status for create something successfully
                } else {
                    res.writeHead(500, {"Content-Type" : "application/json"});
                }
                res.write(JSON.stringify(addNew));
                res.end();     
        });
};

const giveBackBook = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookID = parsedUrl.query.id;

    const returnedBook = await BookModel.giveBack(bookID)
        if(returnedBook.done) {
            res.writeHead(200, {"Content-Type" : "application/json"});
        } else {
            res.writeHead(404, {"Content-Type" : "application/json"});
        };
        res.write(JSON.stringify(returnedBook));
        res.end();
};

const editBook = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookID = parsedUrl.query.id;
    let bookNewInfos = "";
        req.on("data", (data) => {
            bookNewInfos = bookNewInfos + data.toString();
        });
        req.on("end", async () => {
            const reqBody = JSON.parse(bookNewInfos);
                const edited = await BookModel.edit(bookID, reqBody)
                if(edited) {
                    res.writeHead(200, {"Content-Type" : "application/json"});
                } else {
                    res.writeHead(500, {"Content-Type" : "application/json"});
                }
                res.write(JSON.stringify(edited));
                res.end();
        });
};

const rentBook = (req, res) => {
    let reqBody = "";

        req.on('data', (data) => {
            reqBody = reqBody + data.toString();
        });

        req.on('end', async () => {
            let {userID, bookID} = JSON.parse(reqBody);

            const isFreeBook = await BookModel.isFree(bookID);

            if(isFreeBook) {
                const newRent = {
                    userID,
                    bookID
                };
                const rent = await BookModel.rent(bookID, newRent)
                if(rent) {
                    res.writeHead(201, {"Content-Type" : "application/json"});
                } else {
                    res.writeHead(500, {"Content-Type" : "application/json"});

                }
                res.write(JSON.stringify(rent))
                res.end();
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