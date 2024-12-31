import { BrowserRouter, Routes, Route } from "react-router";
import LobbyPage from "./LobbyPage";
import CodeBlockId from "./CodeBlockId";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [activeCodeBlockId, setActiveCodeBlockId] = useState(-1);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("ws://localhost:3000", {
      reconnectionDelayMax: 10000,
    });
    socket.on("codeBlockInfo", (recivedMesage) => {
      console.log(recivedMesage);
      const { activeCodeBlockId, codeBlocks } = recivedMesage;
      setCodeBlocks(codeBlocks);
      setActiveCodeBlockId(activeCodeBlockId);
    });

    socket.on("codeBlockActivated", (activeCodeBlockId) =>
      setActiveCodeBlockId(activeCodeBlockId)
    );

    socket.on("restart code block id", () => {
      console.log("restart- first listener");
      setActiveCodeBlockId(-1);
    });

    setSocket(socket);
    //cleanup:
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LobbyPage
              codeBlocks={codeBlocks}
              activeCodeBlockId={activeCodeBlockId}
            />
          }
        />
        <Route
          path="/CodeBlock/:id"
          element={<CodeBlockId codeBlocks={codeBlocks} socket={socket} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
