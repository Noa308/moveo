import { useEffect } from "react";

const CodeBlock = ({ codeBlock, socket }) => {
  useEffect(() => {
    codeBlock
      ? socket.emit("enterCodeBlock", codeBlock.id)
      : console.log("codeBlock is null");
  }, [socket, codeBlock]);

  return (
    <div>
      <div>{JSON.stringify(codeBlock)}</div>
    </div>
  );
};

export default CodeBlock;
