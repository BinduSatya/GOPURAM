import CreateMemory from "../components/createMemory";
import MemoriesCard from "../components/MemoriesCard";

const MemoriesPage = () => {
  return (
    <div className="p-4 sm:p-6 bg-base-200 lg:p-8 h-full">
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="container mx-auto space-y-10 static">
          <div className="flex flex-col sticky right-10 sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Memories
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <MemoriesCard key={i} />
            ))}
            <CreateMemory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage;
