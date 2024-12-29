import { BrowserRouter, Routes, Route } from "react-router";
import LobbyPage from "./LobbyPage";
import CodeBlock from "./CodeBlock";

function App() {
  return (
    <BrowserRouter>
      <Routes className="bg-blue-50 min-h-screen text-blue-950 flex flex-col items-center w-full">
        <Route path="/" element={<LobbyPage />} />
        <Route path="/Groups/:id" element={<CodeBlock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
