import TripMemory from "../models/TripMemory.model.js";

export const getAllMemory = async (req, res) => {
  try {
    const TripMemories = await TripMemory.find();
    console.log(TripMemories);
    return res.status(200).json({ success: true, message: TripMemories });
  } catch (e) {
    console.log("error occured", e);
    return res.status(404).json({ success: false, message: e });
  }
};

export const postMemory = async (req, res) => {
  try {
    console.log("Memory endpoint hit", req.body);
    const { tripName, ownerName, date, link, image } = req.body;
    // if (!tripName || !ownerName || !date || !link) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Data not filled" });
    // }
    const newMemory = await TripMemory.create({
      tripName,
      ownerName,
      date,
      link,
      image,
    });
    return res.status(201).json({
      success: true,
      data: newMemory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Memory not created", error: error });
  }
};
