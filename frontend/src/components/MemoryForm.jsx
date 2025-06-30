import React, { useState, useEffect } from "react";
import { postMemory } from "../lib/api";

const MemoryForm = ({ onClose }) => {
  const [form, setForm] = useState({
    tripName: "",
    ownerName: "",
    date: "",
    link: "",
    image: null,
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10); // trigger animation after mount
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
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await postMemory(form);
      console.log("Memory submitted successfully", res.data);
    } catch (e) {
      console.log("error while submitting", e);
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center transition-opacity justify-center bg-black bg-opacity-60"
      onClick={() => onClose && onClose()}
    >
      <div
        className={`bg-base-100 bg-opacity-95 p-6 w-11/12 max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow relative transform transition-all duration-300 ease-in-out ${
          show ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="flex flex-col">
            Trip Name
            <input
              type="text"
              name="tripName"
              value={form.tripName}
              onChange={handleChange}
              className="border rounded p-2 bg-base-200"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Owner Name
            <input
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="border rounded p-2 bg-base-200"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded p-2 bg-base-200"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Google Drive Link
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="border rounded p-2 bg-base-200"
              //   required
            />
          </label>
          <label className="flex flex-col">
            Trip Image
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border rounded p-2 bg-base-200"
              //   required
            />
          </label>
          <div className="flex w-full gap-2">
            <button
              type="submit"
              className="bg-accent text-white w-1/2 rounded p-2 hover:bg-primary"
            >
              Submit
            </button>
            <button
              type="button"
              className="text-xl bg-secondary w-1/2 rounded p-2 hover:bg-red-600"
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
