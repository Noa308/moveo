// https://socket.io/docs/v4/tutorial/introduction
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { client, connect } from "./db.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
}); // new websocket server

let state = {
  codeBlocks: [],
  userCount: 0,
  activeCodeBlockId: -1,
  solution: "code solution",
  editedCode: "code template",
  activeUsers: new Map(),
};

server.listen(3000, async () => {
  //init
  await connect();
  const { rows } = await client.query(`select * from code_blocks`);
  state["codeBlocks"] = rows;

  //allow connections
  io.on("connection", (socket) => {
    //"connection" is saved word
    console.log("new connection");
    const userId = socket.id;

    let toSend = {
      codeBlocks: state["codeBlocks"],
      activeCodeBlockId: state["activeCodeBlockId"],
    };
    socket.emit("codeBlockInfo", toSend);

    socket.on("enterCodeBlock", (codeBlockId) => {
      console.log(`enter code block: ${codeBlockId} the user: ${userId}`);

      //check if Tom enter the room/ other student
      if (state["activeCodeBlockId"] !== -1) {
        if (!state["activeUsers"].has(userId)) {
          state["userCount"]++;
          console.log(`student enter the block id , student:${userId}`);
          io.emit("number of users", state["userCount"]);
          state["activeUsers"].set(userId, userId);
        }
      } else {
        state["activeCodeBlockId"] = codeBlockId;
        io.emit("codeBlockActivated", codeBlockId);
        if (!state["activeUsers"].has(userId)) {
          state["activeUsers"].set(userId, userId);
        }
        socket.emit("this is the mentor");
        console.log(`mentor enter the code block, id: ${userId}`);
      }
    });

    socket.on("changeCode", (codeToShow) => {
      state["editedCode"] = codeToShow;
      io.emit("editedCode", codeToShow);
    });
    //"on" is when this event happend
    //"emit" send the event (io.emit = send to all connected sockets, socket.emit = send to this socket)

    socket.on("user left the code block", () => {
      console.log(`user disconnected, user: ${userId}`);
      state["activeUsers"].delete(userId);
      state["userCount"]--;
      io.emit("number of users", state["userCount"]);
    });

    socket.on("mentor left the code block", () => {
      console.log(`mentor disconnected, mentor: ${userId}`);
      state = {
        userCount: 0,
        activeCodeBlockId: -1,
        solution: "code solution",
        editedCode: "code template",
        activeUsers: new Map(),
      };
      io.emit("restart code block id");
    });
  });
});

async function cleanup() {
  await client.end();
  setTimeout(function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30 * 1000);
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
