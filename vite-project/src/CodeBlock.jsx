import { useEffect, useState } from "react";
import useGoToPath from "./useGoToPath";

const CodeBlock = ({ codeBlock, socket }) => {
  const [codeToShow, setCodeToShow] = useState("template of code");
  const [isMentor, setIsMentor] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const goToPath = useGoToPath();

  useEffect(() => {
    if (codeBlock) {
      socket.emit("enterCodeBlock", codeBlock.id);
    }
    if (codeBlock && codeToShow === "template of code") {
      setCodeToShow(codeBlock.template);
    }
  }, [socket, codeBlock, codeToShow]);

  useEffect(() => {
    socket.on("number of users", (usersCount) => {
      setUsersCount(usersCount);
    });
    socket.on("editedCode", (editedCode) => {
      setCodeToShow(editedCode);
      //without this only my UI will see the changes and with this all the users will see
    });
    //cleanup:
    return () => {
      socket.off("number of users");
      socket.off("editedCode");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("this is the mentor", () => {
      setIsMentor(true);
    });
    // cleanup:
    return () => {
      socket.off("this is the mentor");
    };
  }, [socket, isMentor]);

  const handleOnChange = (e) => {
    setCodeToShow(e.target.value);
    socket.emit("changeCode", e.target.value);
    if (codeToShow === codeBlock.solution) {
      setCodeToShow(":)");
    }
  };

  const handleOnClick = () => {
    if (isMentor) {
      socket.emit("mentor left the code block");
    } else {
      socket.emit("user left the code block");
    }
    goToPath(`/`);
    // socket.disconnect();
  };

  return codeBlock ? (
    <div className="bg-orange-50 min-h-screen text-orange-900 flex flex-col items-center w-full pt-16">
      <p className="font-extrabold text-5xl pb-5">{codeBlock.name}:</p>
      <p>{isMentor ? "Hello Mentor" : "Hello student"}</p>
      <p>number of activated users: {usersCount}</p>

      {/* textarea is like "input" but this way the text start from the top */}
      {/* i checked and the "code editor" can handle with text that is bigger then w-96 X H-96 */}
      <textarea
        type="text"
        value={codeToShow}
        className="h-96 w-96 bg-slate-900 text-white p-2 resize-none"
        onChange={handleOnChange}
      ></textarea>
      <button
        onClick={handleOnClick}
        className="my-2 border-2 rounded-md border-orange-800 bg-orange-800 text-orange-100 p-2"
      >
        leave the code block
      </button>
    </div>
  ) : (
    <div className="h-96 w-96 bg-slate-900 text-white"></div>
  );
};

export default CodeBlock;
