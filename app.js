const express = require("express");
const usersRouter = require("./routes/user.js");
const cartsRouter = require("./routes/cart.js");
const goodsRouter = require("./routes/goods.js");
const { Server } = require("http");

const app = express();
const http = Server(app);

app.use(express.json());
app.use("/api", express.urlencoded({ extended: false }), [
  usersRouter,
  cartsRouter,
  goodsRouter,
]);
app.use(express.static("assets"));

module.exports = http;
