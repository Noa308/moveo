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
  solution: "",
  editedCode: "",
};

server.listen(3000, async () => {
  //init
  await connect();
  const { rows } = await client.query(`select * from code_blocks`);
  state["codeBlocks"] = rows;

  //allow connections
  io.on("connection", (socket) => {
    console.log("new connection");
    let toSend = {
      codeBlocks: state["codeBlocks"],
      activeCodeBlockId: state["activeCodeBlockId"],
    };
    socket.emit("codeBlockInfo", toSend);

    socket.on("enterCodeBlock", (codeBlockId) => {
      console.log(`enter code block: ${codeBlockId}`);

      //check if Tom enter the room/ other student
      if (state["activeCodeBlockId"] !== -1) {
        state["userCount"]++;
      } else {
        state["activeCodeBlockId"] = codeBlockId;
        io.emit("codeBlockActivated", codeBlockId);
      }
    });
    //"on" is when this event happend
    //"emit" send the event (io.emit = send to all connected sockets, socket.emit = send to this socket)
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
