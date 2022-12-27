const socketIo = require("socket.io");
const http = require("./app");

const io = socketIo(http);

io.on("connection", (sock) => {
  const { watchBuying, watchByeBye } = initSocket(sock);

  watchBuying();

  watchByeBye();
});

function initSocket(sock) {
  console.log(sock.id, "새로운 소켓이 연결됬어요.");
  // sock.on을 대신해서, 어떤 역할을 하는지 추상화 한 함수
  function watchEvent(eventName, func) {
    sock.on(eventName, func);
  }

  // 현재 접속한 모든 클라이언트에게 메세지를 전송하는 함수
  function sendMessageAll(eventName, data) {
    io.emit(eventName, data);
  }

  return {
    watchBuying: () => {
      watchEvent("BUY", (data) => {
        const emitData = {
          ...data,
          date: new Date().toISOString(),
        };

        sendMessageAll("BUY_GOODS", emitData);
      });
    },
    watchByeBye: () => {
      watchEvent("disconnect", () => {
        console.log(sock.id, "연결이 끊어졌어요.");
      });
    },
  };
}
