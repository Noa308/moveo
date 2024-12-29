import { BrowserRouter, Routes, Route } from "react-router";
import LobbyPage from "./LobbyPage";
import CodeBlockId from "./CodeBlockId";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    const socket = io("ws://localhost:3000", {
      reconnectionDelayMax: 10000,
    });
    socket.on("codeBlockInfo", (recivedMesage) => {
      console.log(recivedMesage);
      setCodeBlocks(recivedMesage["codeBlocks"]);
    });
    //cleanup:
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage codeBlocks={codeBlocks} />} />
        <Route path="/CodeBlock/:id" element={<CodeBlockId />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
