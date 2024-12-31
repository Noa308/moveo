import useGoToPath from "./useGoToPath";

const LobbyPage = ({ codeBlocks, activeCodeBlockId }) => {
  const goToPath = useGoToPath();

  const handleOnClick = (e) => {
    const BlockId = Number(e.target.value);
    if (
      (BlockId && activeCodeBlockId === -1) ||
      BlockId === activeCodeBlockId
    ) {
      goToPath(`/CodeBlock/${BlockId}`);
    } else {
      alert("please enter only the active room");
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen text-orange-900 flex flex-col items-center w-full pt-16">
      <label className="font-extrabold text-5xl pb-5">Choose code block:</label>
      <div className="flex flex-col text-xl my-4">
        {codeBlocks ? (
          codeBlocks.map((block) => {
            let className =
              "my-2 border-2 rounded-md border-orange-800 bg-orange-800 text-orange-100 p-2";
            if (activeCodeBlockId !== -1) {
              if (block.id !== activeCodeBlockId)
                className += " border-gray-300 bg-gray-300";
            }
            return (
              <button
                className={className}
                key={block.id}
                value={block.id}
                onClick={handleOnClick}
              >
                code block: {block.name}
              </button>
            );
          })
        ) : (
          <p>add a code block</p>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
