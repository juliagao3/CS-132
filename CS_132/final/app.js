/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: June 15, 2024
    This is app.js that implements the backend API for the final project which inclues 4 GET 
    endpoints and 2 POST endpoints. The two chosen features which are FAQ and Promotion uses
    GET endpoints.
*/

"use strict";

const express = require("express");
const app = express();
const fsp = require("fs/promises");
const multer = require("multer");
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const DEBUG = true;

app.use(express.static("public"));
app.use(multer().none()); 
app.use(express.urlencoded());
app.use(express.json());

/** Returns a JSON dictionary of all the products
* Gives a 500 error when server goes wrong
*/
app.get("/menu", async (req, res, next) => {
    try{
        const data = await fsp.readFile("menu.json", "utf8");
        const contents = JSON.parse(data);
        res.json(contents);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/** Returns a list of all the products in the specific category in text
* Gives a 400 error when category doesn't exist
* Gives a 500 error with reading file or server error
*/
app.get("/menu/:category", async (req, res, next) => {
    try {
        let categoryDir = req.params.category.toLowerCase();
        const data = await fsp.readFile("menu.json", "utf8");
        const contents = JSON.parse(data);

        if (!contents.hasOwnProperty(categoryDir)) {
            res.status(CLIENT_ERR_CODE).send(CLIENT_ERR_CODE + 
                ` Category '${categoryDir}' not found.`);
            return; 
        }

        res.type("text");
        res.send(contents[categoryDir]);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/** Returns a specific item belonging to a specific category in text
* Gives a 400 error when category doesn't exist or item doesn't exist
* Gives a 500 error with reading file or server error
*/
app.get("/menu/:category/:item", async (req, res, next) => {
    try {
        let categoryDir = req.params.category.toLowerCase();
        let item = req.params.item;
        const data = await fsp.readFile("menu.json", "utf8");
        const contents = JSON.parse(data);

        if (!contents.hasOwnProperty(categoryDir)) {
            res.status(CLIENT_ERR_CODE).send(CLIENT_ERR_CODE + " Category " + 
            categoryDir + " was not found.");
            return;
        }

        let value = contents[categoryDir].find(tea => tea.name == item);

        if (!value) {
            res.status(CLIENT_ERR_CODE).send(CLIENT_ERR_CODE + " Item " + 
            item + " was not found.");
            return;
        }

        res.type("text");
        res.send(value);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/** Returns a JSON dictionary of all the additional information
* Gives a 500 error when server goes wrong
*/
app.get("/other-info", async (req, res, next) => {
    try {
        const data = await fsp.readFile("customizations.json", "utf8");
        const contents = JSON.parse(data);
        res.json(contents);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**  Adds a new message/feedback to JSON file
* Required paramters: first name, last name, email, message
* Returns a success message when form is submitted successfully
* Gives a 400 error if missing any parameters
* Gives a 500 error when server goes wrong or cannot read file 
*/
app.post("/contacts", async (req, res, next) => {
    let message = processMsg(req.body.first, req.body.last, req.body.email, req.body.message);
    if (!message) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Required POST parameters for /contact: first name, last name, email, message."));
    }
    try {
        let allMessages = await fsp.readFile("all-message.json", "utf8");
        let messages = JSON.parse(allMessages);
        messages.push(message);
        await fsp.writeFile("all-message.json", JSON.stringify(messages, null, 2), "utf8");
        res.type("text");
        res.send("Your message has been recieved! Will respond soon through email.");
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Helper function to convert the values into JSON formant
 * @param {String} firstName - first name
 * @param {String} lastName - last name
 * @param {String} email - email
 * @param {String} msg  - message/feedback
 * @return {Object} - JSON formatted
 */
function processMsg(firstName, lastName, email, msg) {
    let info = null;
    if (firstName && lastName && email && msg) {
        info = {
            "first name": firstName,
            "last name": lastName,
            "email": email,
            "message": msg
        };
    }
    return info;
}

/** Adds a new purchase to the JSON file
* Returns a success message when purchase is added successfully
* Gives a 500 error when server goes wrong or cannot read file 
*/ 
// Note, can use localstorage on the client side to store items so that the
// items are kept after refreshing the page
app.post("/cart",  async (req, res, next) => {
    const items = req.body;
    
    try {
        let allItems = await fsp.readFile("cart.json", "utf-8");
        let cart = JSON.parse(allItems);
        
        cart.push(items);

        await fsp.writeFile("cart.json", JSON.stringify(cart, null, 2), "utf8");

        res.type("text");
        res.send("Order confirmed! You will recieve a confirmation email from us soon!");

    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// Error handling middleware that is able to handle different types of errors
function errorHandler(err, req, res, next) {
    if (DEBUG) {
        console.error(err);
    }
    res.type("text");
    res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Listening " + PORT + "...");
});