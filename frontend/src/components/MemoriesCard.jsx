import { Link } from "react-router";
import { getCleanDay } from "../lib/utils";

const MemoriesCard = ({ memory }) => {
  const day = getCleanDay(memory?.date);

  return (
    <Link
      to={memory.link}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer text-base-100 text-xs break-all select-none"
    >
      <div className="transition cursor-pointer bg-base-300 image-full w-auto shadow-sm hover:scale-105 hover:shadow-lg hover:opacity-100 active:scale-95 card card-border">
        <figure>
          <img
            src={
              memory.image === null ||
              memory.image === "" ||
              memory.image === "image place holder text"
                ? "travel-memory.png"
                : memory.image
            }
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{memory.tripName || "Card Title"}</h2>
          <div className="flex flex-col justify-center">
            <p>{memory.ownerName || "Card Title"}</p>
            <p>{day === undefined ? "dd:mm::yy" : day}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemoriesCard;
