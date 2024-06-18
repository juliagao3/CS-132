/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: June 7, 2024
    This is app.js that implements the backend API for my personal
    website. 
*/

"use strict";

const express = require("express");
const app = express();
const fsp = require("fs/promises");
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const SERVER_ERROR = "Something went wrong on the server, please try again later.";

app.use(express.static("public"));

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

app.get("/all-courses/:course", async (req, res, next) => {
    try {
        let course = req.params.course;
        const data = await fsp.readFile("course.json", "utf8");
        const contents = JSON.parse(data);
        res.type("text");
        res.send(contents['courses'].find(courses => courses.number == course));
    } catch (err) {
        if (err.code === "ENOENT") {
            res.status(CLIENT_ERR_CODE);
            err.message = "Category " + categoryDir + " not found.";
        }
        else {
            res.status(SERVER_ERR_CODE);
            err.message = SERVER_ERROR;
        }
        next(err);
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, 