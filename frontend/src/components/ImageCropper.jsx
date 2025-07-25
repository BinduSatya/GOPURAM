import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../lib/utils";

const ImageCropper = ({ image, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    async (_, croppedAreaPixels) => {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    },
    [image, onCropComplete]
  );

  return (
    <div className="relative w-full h-64 bg-black">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default ImageCropper;
