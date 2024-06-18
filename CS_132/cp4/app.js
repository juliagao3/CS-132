/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: June 13, 2024
    This is app.js that implements the backend API for my personal
    website which is for fetching all courses and specific course.
*/

"use strict";

const express = require("express");
const app = express();
const fsp = require("fs/promises");
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const SERVER_ERROR = "Something went wrong on the server, please try again later.";

app.use(express.static("public"));

// Returns a JSON list of all the classes
// Returns a 500 error when something goes wrong with server
app.get("/all-courses", async (req, res, next) => {
    try {
        const result = await fsp.readFile("course.json", "utf8");
        const contents = JSON.parse(result);
        res.json(contents); 
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

// Returns a dictionary of specific course
// Returns a 400 error when the input course is not valid
// Returns a 500 error when something goes wrong with server
app.get("/all-courses/:course", async (req, res, next) => {
    try {
        let course = req.params.course;
        const data = await fsp.readFile("course.json", "utf8");
        const contents = JSON.parse(data);
        res.type("text");
        let value = contents['courses'].find(courses => courses.number == course);

        if (!value) {
            res.status(CLIENT_ERR_CODE).send(CLIENT_ERR_CODE + " Course " + course + " not found.");
            return;
        }

        res.send(value);
    } catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Listening " + PORT + "...");
});