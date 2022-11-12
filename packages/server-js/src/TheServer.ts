import e from "express";
import http from "http";
import Server from "socket.io";

/**
 * 单例模式，确保socket.io只有一个实例
 */
export default class TheServer {
  //   private static io: IO | undefined = undefined;
  private static io = undefined;

  private constructor() {
    TheServer.io = undefined;
  }
  public static get instance() {
    if (this.io === undefined) {
      //   // 类型约束，为了开发方便暂时注释
      //   this.io = new Server<
      //     ClientToServerEvents,
      //     ServerToClientEvents,
      //     InterServerEvents,
      //     SocketData
      //   >(http.createServer(e()), {
      //     cors: {
      //       origin: "*",
      //     },
      //   });
      const httpServer = http.createServer(e());

      this.io = Server(httpServer, {
        // 跨域
        // cors: {
        //   origin: "*",
        // },
        origins: ["*", "localhost:3000"],
      });

      const port = 3080;
      httpServer.listen(port);
      console.log("# server is running on " + port);
    }
    return this.io;
  }
}
// export interface ServerToClientEvents {
//   message: (msg: string) => void;
//   "clients-updated": (info: {
//     username: string | undefined;
//     currentRoom: string | undefined;
//   }) => void;
//   "current-room-users-updated": (
//     users: { id: string | undefined; name: string | undefined }[]
//     /**
//      * server.Alls
//      */
//   ) => void;
//   "current-room-message-updated": (
//     messages: { content: string; sender: string }[]
//   ) => void;
// }

// export interface ClientToServerEvents {
//   "set-username": (username: string) => void;
//   "join-room": (roomname: string) => void;
//   "room-data-updated": (roomname: string) => void;
//   "send-to-current-room": (msg: string) => void;
//   "send-to-all": (msg: string) => void;
//   "send-to-other": (msg: string) => void;
//   "send-to-me": (msg: string) => void;
// }

// export interface InterServerEvents {
//   ping: () => void;
// }

// export interface SocketData {
//   username: string;
//   currentRoom: string;
// }

// export type ServerSocket = Socket<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >;

// type IO = Server<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >;
