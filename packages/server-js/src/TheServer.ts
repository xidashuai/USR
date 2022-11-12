// import { createServer } from "http";
// import Server from "socket.io";

// /**
//  * 单例模式，确保socket.io只有一个实例
//  */
// export default class TheServer {
//   //   private static io: IO | undefined = undefined;
//   private static io = undefined;

//   private constructor() {
//     TheServer.io = undefined;
//   }
//   public static get instance() {
//     if (this.io === undefined) {
//       const httpServer = createServer();

//       this.io = new Server(httpServer, {
//         // 跨域
//         // cors: {
//         //   origin: "*",
//         // },
//         // origins: ["*", "localhost:3000"],
//         origins: ["*"],
//         allowEIO3: true, // false by default,
//         // handlePreflightRequest: (req, res) => {
//         //   res.writeHead(200, {
//         //     "Access-Control-Allow-Origin": "*",
//         //     "Access-Control-Allow-Methods": "GET,POST",
//         //     // "Access-Control-Allow-Headers": "my-custom-header",
//         //     "Access-Control-Allow-Credentials": true,
//         //   });
//         //   res.end();
//         // },
//         cors: {
//           origin: "*",
//         },
//       });

//       const port = 4096;
//       this.io.on("connection", (socket) => {
//         console.log({ id: socket.id });
//       });

//       this.io.on("connect_error", (err) => {
//         console.log(`connect_error due to ${err.message}`);
//       });

//       httpServer.listen(port);
//       console.log("# server is running on " + port);
//     }
//     return this.io;
//   }
// }

import e from "express";
import http from "http";
import { Server } from "socket.io";

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

      this.io = new Server(httpServer, {
        // 跨域
        cors: {
          origin: "*",
        },
        // origins: ["*"],
        allowEIO3: true,
      });

      const port = 4096;
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
