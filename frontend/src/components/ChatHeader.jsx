import React from "react";

const ChatHeader = ({ fullName: name }) => {
  return (
    <div>
      <header className="py-2 px-3 bg-primary text-white text-lg font-bold">
        Chatting with {name}
      </header>
    </div>
  );
};

export default ChatHeader;
