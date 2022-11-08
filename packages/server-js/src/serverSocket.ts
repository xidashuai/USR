import TheServer, { ServerSocket } from "./TheServer.js";

const server = TheServer.instance;

export const initSocket = () => {
  server.on("connection", (client) => {
    // 加入默认房间
    client.join('Defult room')
    client.data.currentRoom = "Defult room";

    console.log("客户端id", { id: client.id });

    client.on("add-shape", (shape) => {
      // 发送给其他客户端
      client.broadcast.emit("add-shape", shape);
    });

    client.on("join-room", (roomname: string) => {
      client.data.currentRoom = roomname;
      // TODO: 存入数据库
    });

    client.on("send-to-current-room", (msg: string) => {
      server.to(client.data.currentRoom as string).emit("message", msg);
    });

    client.on("send-to-all", (msg: string) => {
      server.emit("message", msg);
    });

    client.on("send-to-other", (msg: string) => {
      client.broadcast.emit("message", msg);
    });

    client.on("send-to-me", (msg: string) => {
      client.emit("message", msg);
    });

    client.on("set-username", (username: string) => {
      client.data.username = username;
    });

    client.on("send-to-room", (roomname: string) => {
      server.to(roomname).emit("message", "someMessage");
    });
  });
};
