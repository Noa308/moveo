import { useParams } from "react-router";
import CodeBlock from "./CodeBlock";

const CodeBlockId = () => {
  const { id } = useParams();
  return (
    <div>
      <CodeBlock id={id} />
    </div>
  );
};

export default CodeBlockId;
