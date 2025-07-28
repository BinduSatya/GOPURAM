export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getCleanTime = (mongoTimestamp) => {
  const date = new Date(mongoTimestamp);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getCleanDay = (mongoTimestamp) => {
  const date = new Date(mongoTimestamp);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: true,
  });
};

export const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    };
    image.onerror = (e) => reject(e);
  });
};
