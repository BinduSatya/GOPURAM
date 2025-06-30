import { Link } from "react-router";
import tripImg from "../../public/i.png";

const MemoriesCard = () => {
  return (
    <div className="flex justify-between rounded-lg items-start bg-primary px-3 py-2">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-2xl text-neutral font-medium">Trip Name</span>
        <span className="font-medium text-base-100">Owner Name</span>
        <div className="text-s text-base-100">Date</div>
        <Link to="#" className="cursor-pointer text-base-100 text-xs">
          Link
        </Link>
      </div>
      <div className="">
        <img
          className="size-24 object-top-left shadow-xl mr-3 rounded-md"
          alt=""
          src={tripImg}
        />
      </div>
    </div>
  );
};

export default MemoriesCard;
