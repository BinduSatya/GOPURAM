import { useState, useEffect } from "react";
import { postMemory } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import ImageCropper from "./ImageCropper.jsx";

const MemoryForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();
  const today = new Date().toISOString().split("T")[0];

  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("tripName", form.tripName);
  //   formData.append("ownerName", authUser.fullName);
  //   formData.append("date", form.date);
  //   formData.append("link", form.link);
  //   formData.append("image", croppedImage);
  //   await mutateAsync(formData);
  // };

  const [form, setForm] = useState({
    tripName: "",
    ownerName: "",
    date: "",
    link: "",
    image: null,
  });
  const [show, setShow] = useState(false);

  const { mutate } = useMutation({
    mutationFn: postMemory,
    onSuccess: () => {
      toast.success("Successfully, uploaded"),
        queryClient.invalidateQueries(["all-memories"]);
    },
    onLoading: () => {
      toast("Loading, please wait");
    },
  });

  useEffect(() => {
    setShow(true);
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log("name", name);
    console.log("value", value);
    console.log("files", files);
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // const res = mutate(form);
      const formData = new FormData();
      formData.append("tripName", form.tripName);
      formData.append("ownerName", authUser.fullName);
      formData.append("date", form.date);
      formData.append("link", form.link);
      formData.append("image", croppedImage);
      const res = mutate(formData);
      console.log("Memory submitted successfully", formData);
      console.log("res is", res);
    } catch (e) {
      console.log("error while submitting", e);
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed card inset-0  z-50 flex items-center transition-opacity justify-center bg-black bg-opacity-60"
      onClick={() => onClose && onClose()}
    >
      <div
        className={`bg-base-100 bg-opacity-95 px-2 py-1 w-11/12 max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow relative transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto ${
          show ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex card-body flex-col gap-2">
          <label className="flex flex-col">
            Trip Name
            <input
              type="text"
              name="tripName"
              value={form.tripName}
              autoComplete="off"
              onChange={handleChange}
              className="flex-1 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-base-100 border border-neutral-300 text-base-content"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Owner Name
            <input
              type="text"
              name="ownerName"
              value={authUser.fullName}
              onChange={handleChange}
              autoComplete="off"
              className="flex-1 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-base-100 border border-neutral-300 text-base-content"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              max={today}
              autoComplete="off"
              onChange={handleChange}
              className="flex-1 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-base-100 border border-neutral-300 text-base-content"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Google Drive Link
            <input
              type="url"
              name="link"
              autoComplete="off"
              value={form.link}
              onChange={handleChange}
              className="flex-1 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-base-100 border border-neutral-300 text-base-content"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Trip Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-secondary mb-3"
            />
            {selectedImage && (
              <ImageCropper
                image={selectedImage}
                onCropComplete={setCroppedImage}
              />
            )}
          </label>
          <div className="flex w-full gap-2">
            <button
              type="submit"
              className="btn btn-accent  rounded-full  w-1/2 p-2 hover:bg-primary"
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary  rounded-full w-1/2 p-2 hover:bg-warning"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryForm;
