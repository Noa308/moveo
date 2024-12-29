import { useParams } from "react-router";
import CodeBlock from "./CodeBlock";

const CodeBlockId = ({ codeBlocks, socket }) => {
  const { id } = useParams();
  const codeBlock = codeBlocks.find((el) => el.id == id);
  return (
    <div>
      <CodeBlock codeBlock={codeBlock} socket={socket} />
    </div>
  );
};

export default CodeBlockId;
