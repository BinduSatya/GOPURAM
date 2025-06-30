const VideoCallPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Make Group Call
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="flex justify-between rounded-lg items-start bg-primary px-3 py-2"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Make Individual Call
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
