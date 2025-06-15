import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const arrayBufferToBase64 = (buffer: Uint8Array) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const AppPhotoUploader = forwardRef((props: any, ref) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("");

  useImperativeHandle(ref, () => {
    return {
      getSelectedImage: () => selectedImageBase64,
    };
  });

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        setSelectedImageBase64(
          `data:image/png;base64, ${arrayBufferToBase64(byteArray)}`
        );
      };
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<FileUploadOutlinedIcon />}
    >
      Upload photo
      <VisuallyHiddenInput type="file" onChange={onFileChange} />
    </Button>
  );
});

export default AppPhotoUploader;
