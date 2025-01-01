// https://socket.io/docs/v4/tutorial/introduction

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { client, connect } from "./db.js";

const origin = process.env.RAILWAY_PUBLIC_DOMAIN || "*";
const port = process.env.PORT || 3000;

const app = express();
app.use("/", express.static("src/dist"));
app.get("/", (req, res) => {
  res.sendFile("src/dist/index.html");
});
app.get("*", (req, res) => {
  console.log("returning 404 to url " + req.url);
  res.statusCode(404).send();
});
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: origin,
  },
}); // new websocket server

const defaultState = {
  userCount: 0,
  activeCodeBlockId: -1,
  solution: "code solution",
  editedCode: "code template",
  showText: true,
  activeUsers: new Map(),
  mentorId: -1,
};

let state = {
  codeBlocks: [],
  ...defaultState,
};

server.listen(port, "0.0.0.0", async () => {
  console.log("SERVER IS STARTING");
  //init
  await connect();
  const { rows } = await client.query(`select * from code_blocks`);
  state["codeBlocks"] = rows;

  //allow connections
  io.on("connection", (socket) => {
    //"connection" is a saved word
    console.log("new connection");
    const userId = socket.id;

    let toSend = {
      codeBlocks: state["codeBlocks"],
      activeCodeBlockId: state["activeCodeBlockId"],
    };
    socket.emit("codeBlockInfo", toSend);
    console.log("send the coode blocks info");

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
        state["mentorId"] = userId;
        console.log(`mentor enter the code block, id: ${userId}`);
      }
    });

    socket.on("changeCode", (codeToShow) => {
      state["editedCode"] = codeToShow;
      io.emit("editedCode", codeToShow);
      console.log("edit code");
    });

    socket.on("changeTextDisplay", (bool) => {
      state["showText"] = bool;
      io.emit("showText", bool);
      console.log("change the show", bool);
    });
    //"on" is when this event happend
    //"emit" send the event (io.emit = send to all connected sockets, socket.emit = send to this socket)

    let userLeft = () => {
      console.log(`user disconnected, user: ${userId}`);
      state["activeUsers"].delete(userId);
      state["userCount"]--;
      io.emit("number of users", state["userCount"]);
    };

    socket.on("user left the code block", userLeft);

    let mentorLeft = () => {
      console.log(`mentor disconnected, mentor: ${userId}`);
      state = {
        ...state,
        ...defaultState,
      };
      io.emit("restart code block id");
    };
    socket.on("mentor left the code block", mentorLeft);
    socket.on("disconnect", () => {
      if (userId === state["mentorId"]) {
        mentorLeft();
      } else {
        userLeft();
      }
    });
  });
  console.log("SERVER IS UP");
});

async function cleanup() {
  // await client.end();
  setTimeout(function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30 * 1000);
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
