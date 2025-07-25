import { useState } from "react";
import MemoryForm from "./MemoryForm";

const CreateMemory = () => {
  const [create, setCreate] = useState(false);

  const handleClick = () => {
    setCreate(true);
  };

  const handleClose = () => {
    setCreate(false);
  };
  return (
    <>
      <div
        className="flex items-center justify-center rounded-lg cursor-pointer 
             bg-secondary text-secondary-content
             hover:bg-accent hover:text-accent-content 
             px-3 py-2"
        onClick={handleClick}
      >
        <div className="text-4xl"> +</div>
      </div>
      {create && <MemoryForm onClose={handleClose} />}
    </>
  );
};

export default CreateMemory;
