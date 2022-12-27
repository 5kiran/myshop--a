const express = require("express");
const usersRouter = require("./routes/user.js");
const cartsRouter = require("./routes/cart.js");
const goodsRouter = require("./routes/goods.js");
const { Server } = require("http");
const socketIo = require("socket.io");

const app = express();
const http = Server(app);
const io = socketIo(http);

app.use(express.json());
app.use("/api", express.urlencoded({ extended: false }), [
  usersRouter,
  cartsRouter,
  goodsRouter,
]);
app.use(express.static("assets"));

io.on("connection", (sock) => {
  console.log("새로운 소켓 연결");

  sock.on("BUY", (data) => {
    const emitData = {
      nickname: data.nickname,
      goodsId: data.goodsId,
      goodsName: data.goodsName,
      date: new Date().toISOString(),
    };

    io.emit("BUY_GOODS", emitData);
  });

  sock.on("disconnect", () => {
    console.log(sock.id, "해당하는 사용자 연결 해제");
  });
});

http.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됬어요");
});
