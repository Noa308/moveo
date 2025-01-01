import { useEffect, useState } from "react";
import useGoToPath from "./useGoToPath";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeBlock = ({ codeBlock, socket }) => {
  const [codeToShow, setCodeToShow] = useState("template of code");
  const [isMentor, setIsMentor] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [showText, setshowText] = useState(true);
  //show text is to show the text, otherwise show the emoji
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
    if (socket) {
      socket.on("number of users", (usersCount) => {
        setUsersCount(usersCount);
      });
      socket.on("editedCode", (editedCode) => {
        setCodeToShow(editedCode);
        //without this only my UI will see the changes and with this all the users will see
      });
      socket.on("showText", (bool) => {
        setshowText(bool);
        //without this only my UI will see the changes and with this all the users will see
      });
      const reset = () => {
        console.log("restart- second listener");
        goToPath(`/`);
      };
      socket.on("restart code block id", reset);
      //cleanup:
      return () => {
        socket.off("number of users");
        //socket.off = stop listen to this. it's not socket.disconnect which close this socket
        socket.off("editedCode");
        socket.off("showText");
        socket.off("restart code block id", reset);
        //when i have more then one listener i need to add the listener to the socket.off.
        // in "socket.off("restart code block id", reset)" the first listener is here(the reset) and the second in "App.jsx"
      };
    }
  }, [socket, goToPath]);

  useEffect(() => {
    socket.on("this is the mentor", () => {
      setIsMentor(true);
    });
    // cleanup:
    return () => {
      socket.off("this is the mentor");
    };
  }, [socket, isMentor]);

  const handleOnChange = (value) => {
    setCodeToShow(value);
    socket.emit("changeCode", value);
    if (value === codeBlock.solution) {
      socket.emit("changeCode", "😀");
      socket.emit("changeTextDisplay", false);
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
      {!showText ? (
        <p className="text-9xl my-6">{codeToShow}</p>
      ) : (
        <AceEditor
          mode="javascript"
          theme="github"
          value={codeToShow}
          onChange={handleOnChange}
          readOnly={isMentor}
        />
      )}
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
