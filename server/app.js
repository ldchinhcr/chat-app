require('dotenv').config({path: '.env'});
const express = require("express");
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connected to database!"))

const router = express.Router();

app.use(router);

router.route("/").get((req,res)=> {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.send("ok!!!!!!!!")
})

module.exports = app;