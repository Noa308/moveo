import useGoToPath from "./useGoToPath";

const LobbyPage = ({ codeBlocks }) => {
  const goToPath = useGoToPath();

  const handleOnClick = (e) => {
    const BlockId = e.target.value;
    if (BlockId) {
      goToPath(`/CodeBlock/${BlockId}`);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen text-orange-900 flex flex-col items-center w-full pt-16">
      <label className="font-extrabold text-5xl pb-5">Choose code block:</label>
      <div className="flex flex-col text-xl my-4">
        {codeBlocks.map((block) => (
          <button
            className="my-2 border-2 rounded-md border-orange-800 bg-orange-800 text-orange-100 p-2"
            key={block.id}
            value={block.id}
            onClick={handleOnClick}
          >
            code block: {block.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LobbyPage;
