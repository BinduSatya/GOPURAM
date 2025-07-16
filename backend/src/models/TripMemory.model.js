import mongoose from "mongoose";
const TripMemorySchema = new mongoose.Schema({
  tripName: {
    type: String,
    // required: true,
  },
  ownerName: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  link: {
    type: String,
    // required: true,
  },
  image: {
    type: String, // URL or file path
    // required: true,
  },
});

const TripMemory = mongoose.model("TripMemory", TripMemorySchema);

export default TripMemory;
