import TheServer from "./TheServer.js";

const server = TheServer.instance;

const pages = new Object();

export const initSocket = () => {
  server.on("connection", (client) => {
    // 加入默认房间
    client.join("Defult room");
    client.data.currentRoom = "Defult room";

    console.log("客户端id", { id: client.id });

    client.on("add-shape", (wb) => {
      // 发送给其他客户端
      client.broadcast.emit("add-shape", wb);
    });

    client.on("init", () => {
      server.emit("init", JSON.stringify(pages));
    });

    client.on("pages-updated", (wb: string /**JSON数据 */) => {
      // 发送给此房间的其他客户端，不包括自己
      client.to(client.data.currentRoom).emit("pages-updated", wb);

      const json = JSON.parse(wb);
      Object.assign(pages, json);
    });

    client.on("test", (wb: string /**JSON数据 */) => {
      // 发送给此房间的其他客户端，不包括自己
      server.to(client.data.currentRoom).emit("test", wb);
    });

    client.on("add-page", (pagename: string) => {
      // // 发送到此房间，包括自己
      // console.log({currentRoom:client.data.currentRoom});
      
      server.to(client.data.currentRoom).emit("add-page", pagename);
    });

    client.on("remove-page", (pagename: string) => {
      // 发送到此房间，包括自己
      server.to(client.data.currentRoom).emit("remove-page", pagename);
    });

    client.on("join-room", (roomname: string) => {
      client.join(roomname)
      client.data.currentRoom = roomname;
      console.log({ roomname });

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
