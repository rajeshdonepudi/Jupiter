import { UpsertTenantModel } from "@/models/Tenant/UpsertTenantModel";
import UpsertTenantValidationScheme from "@/validation-schemes/Tenant/UpsertTenantValidationScheme";
import { Card, CardContent, Typography } from "@mui/material";
import { useFormik } from "formik";
import {
  ChangeEvent,
  lazy,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
const Stack = lazy(() => import("@mui/material/Stack"));
const TextField = lazy(() => import("@mui/material/TextField"));
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import AppModal from "@/components/ui-components/AppModal";
import AppImageCropper from "@/components/ui-components/AppImageCropper";
import { AppVisuallyHiddenInput } from "@/components/ui-components/AppVisualllyHiddenInput";
import ImageUtilities from "@/utilities/ImageUtilities";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";
const UpsertTenantForm = (props: any) => {
  const imagePickerRef = useRef<any>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("");
  const photoCropperRef = useRef<any>(null);

  const [modalState, setModalState] = useState({
    visible: false,
  });

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        setSelectedImageBase64(
          `data:image/png;base64, ${ImageUtilities.convertArrayBufferToBase64(
            byteArray
          )}`
        );
        setModalState(() => {
          return {
            visible: true,
          };
        });
      };
    }
  };

  const onCancelUpdateProfilePicture = () => {
    setModalState(() => {
      return {
        visible: false,
      };
    });
    setSelectedImageBase64("");
  };

  const onProfilePictureConfirmed = async () => {
    const croppedImage = await photoCropperRef?.current?.getCroppedImage();
    const fetchData = async (imageUrl: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          formik.setFieldValue(
            "profilePicture",
            String(reader?.result).split(",")[1]
          );
          onCancelUpdateProfilePicture();
        };
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    if (croppedImage) {
      await fetchData(croppedImage);
    }
  };

  const formik = useFormik<UpsertTenantModel>({
    initialValues: {
      name: "",
      host: "",
      profilePicture: "",
    },
    validationSchema: UpsertTenantValidationScheme(props?.actionId),
    onSubmit: (values: UpsertTenantModel) => {
      props?.onSubmit(values);
    },
  });

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: formik.submitForm,
      resetForm: formik.resetForm,
      setValues: formik.setValues,
    };
  });

  return (
    <>
      <AppVisuallyHiddenInput
        type="file"
        ref={imagePickerRef}
        onChange={onFileChange}
      />
      <Stack
        direction="column"
        alignItems="center"
        spacing={AppConstants.layout.StandardSpacing}
      >
        <form
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          style={{ width: "100%" }}
        >
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                id="name"
                name="name"
                size="small"
                required={true}
                label={"Tenant Name"}
                variant="outlined"
                fullWidth
                value={formik.values?.name}
                onChange={formik.handleChange}
                error={formik.touched?.name && Boolean(formik.errors.name)}
                helperText={formik.touched?.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                id="host"
                name="host"
                size="small"
                required={true}
                label={"Host Name"}
                variant="outlined"
                fullWidth
                value={formik.values?.host}
                onChange={formik.handleChange}
                error={formik.touched?.host && Boolean(formik.errors.host)}
                helperText={formik.touched?.host && formik.errors.host}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Card
                sx={{ cursor: "pointer" }}
                onClick={() => imagePickerRef?.current?.click()}
              >
                <CardContent>
                  <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ height: "200px", width: "100%" }}
                  >
                    <UploadOutlinedIcon />
                    <Typography>Upload Profile Picture</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Stack>
      <AppModal
        modalTitle={"Update profile picture"}
        show={modalState.visible}
        okButtonText={"Update"}
        handleOk={onProfilePictureConfirmed}
        handleClose={onCancelUpdateProfilePicture}
      >
        <Stack>
          <AppImageCropper ref={photoCropperRef} image={selectedImageBase64} />
        </Stack>
      </AppModal>
    </>
  );
};

export default UpsertTenantForm;
