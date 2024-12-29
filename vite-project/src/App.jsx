import { BrowserRouter, Routes, Route } from "react-router";
import LobbyPage from "./LobbyPage";
import CodeBlockId from "./CodeBlockId";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/CodeBlock/:id" element={<CodeBlockId />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
