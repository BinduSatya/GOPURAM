const ChatHeader = ({ reciever }) => {
  return (
    <div>
      <header className="py-2 select-none px-3 bg-base-300 opacity-90 text-lg font-bold flex gap-4 items-center ">
        <img
          className={`w-10 h-10`}
          src={
            reciever.fullName === "Gopuram"
              ? "https://img.icons8.com/doodle/100/conference-call.png"
              : `${reciever?.profilePic || "/user.png"}`
          }
          alt=""
        />
        Chatting with {reciever.fullName}
      </header>
    </div>
  );
};

export default ChatHeader;
