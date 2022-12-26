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

  // io.emit으로 데이터를 전달
  io.emit("BUY_GOODS", {
    nickname: "서버가 보내준 구매자 닉네임",
    goodsId: 10, // 서버가 보내준 상품 데이터 고유 ID
    goodsName: "서버가 보내준 구매자가 구매한 상품 이름",
    date: "서버가 보내준 구매 일시",
  });

  sock.on("BUY", (data) => {
    console.log(data);
  });

  sock.on("disconnect", () => {
    console.log(sock.id, "해당하는 사용자 연결 해제");
  });
});

http.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됬어요");
});
