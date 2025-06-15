import ImageUtilities from "@/utilities/ImageUtilities";
import { Slider, Stack } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import Cropper from "react-easy-crop";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import CropRotateOutlinedIcon from "@mui/icons-material/CropRotateOutlined";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";

const AppImageCropper = forwardRef((props: { image: string }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<any>(null);

  useImperativeHandle(ref, () => {
    return {
      croppedImage: croppedImage,
      getCroppedImage: getCroppedImage,
    };
  });

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    try {
      const croppedImage = await ImageUtilities.getCroppedImg(
        props?.image,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      return croppedImage;
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setCroppedImage(null);
  };

  return (
    <Grid container>
      <Grid
        size={12}
        sx={{ height: "50vh", width: "50vw", position: "relative" }}
      >
        <Cropper
          image={props?.image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Grid>
      <Grid container spacing={0.8}>
        <Grid size={12}>
          <Stack
            spacing={AppConstants.layout.StandardSpacing}
            direction="row"
            sx={{ mb: 1 }}
            alignItems="center"
          >
            <ZoomOutOutlinedIcon />
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e: any, zoom: any) =>
                setZoom(typeof zoom == "number" ? zoom : 0)
              }
            />
            <ZoomInOutlinedIcon />
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack
            spacing={AppConstants.layout.StandardSpacing}
            direction="row"
            sx={{ mb: 1 }}
            alignItems="center"
          >
            <CropRotateOutlinedIcon />
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e: any, rotation: any) =>
                setRotation(typeof rotation == "number" ? rotation : 0)
              }
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default AppImageCropper;
