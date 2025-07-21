import { useQuery } from "@tanstack/react-query";
import CreateMemory from "../components/createMemory";
import MemoriesCard from "../components/MemoriesCard";
import { getAllMemories } from "../lib/api";

const MemoriesPage = () => {
  const { data: Memories, isLoading } = useQuery({
    queryKey: ["all-memories"],
    queryFn: getAllMemories,
  });

  return (
    <div className="p-4 sm:p-6 bg-base-100 lg:p-8 h-full">
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="container mx-auto space-y-10 static">
          <div className="flex flex-col sticky right-10 sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Memories
            </h2>
          </div>
          {isLoading ? (
            <div>Loading Memories</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              <CreateMemory />
              {Memories.map((memory) => (
                <MemoriesCard key={memory._id} memory={memory} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage;
